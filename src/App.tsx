import { useState, useEffect } from 'react';
import BikramSambatCalendar from './components/BikramSambatCalendar';

// Define the interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time to display as HH:MM AM/PM
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${hours}:${minutes} ${ampm}`;
  };

  // Check if device is mobile and if app is already installed
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check if app is running in standalone mode (installed)
    const checkIfInstalled = () => {
      // Define a type for navigator with the standalone property
      interface NavigatorWithStandalone extends Navigator {
        standalone?: boolean;
      }
      
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as NavigatorWithStandalone).standalone || 
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };
    
    checkMobile();
    checkIfInstalled();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button only if not already installed
      if (!isInstalled) {
        setShowInstallButton(true);
        console.log('Install prompt detected!');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // For testing on devices that don't trigger the event
    if (isMobile && !deferredPrompt && !isInstalled) {
      // Show a fallback install button after 3 seconds on mobile if not installed
      const timer = setTimeout(() => {
        if (!showInstallButton && !isInstalled) {
          console.log('Showing fallback install button');
          setShowInstallButton(true);
        }
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [isMobile, deferredPrompt, showInstallButton, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      
      // Hide the install button
      setShowInstallButton(false);
      
      console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
    } else if (isMobile && !isInstalled) {
      // Fallback for iOS devices or when the event isn't available
      alert('To install this app:\n1. Tap the share button\n2. Scroll down and tap "Add to Home Screen"');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-800">Sajilo Calendar</h1>
        <p className="text-center text-gray-600 mb-8">Your Ad-Free Calendar</p>
        
        {isMobile && !isInstalled && (
          <div className="mb-6 flex justify-center">
            <button 
              onClick={handleInstallClick}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-.707.293l-4 4a1 1 0 101.414 1.414L9 6.414V16a1 1 0 102 0V6.414l2.293 2.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 3z" clipRule="evenodd" />
              </svg>
              Install App
            </button>
          </div>
        )}
        
        <BikramSambatCalendar />
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            By <a href="https://github.com/rohan7408" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">Rohan</a>
          </p>
          <p className="mt-2 font-medium text-indigo-600">
            {formatTime(currentTime)}
          </p>
        </div>
        
        {/* Sticky install button at the bottom */}
        {showInstallButton && isMobile && !isInstalled && (
          <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <button 
              onClick={handleInstallClick}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-.707.293l-4 4a1 1 0 101.414 1.414L9 6.414V16a1 1 0 102 0V6.414l2.293 2.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 3z" clipRule="evenodd" />
              </svg>
              Add to Home Screen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
