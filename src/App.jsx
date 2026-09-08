import React, { useState, useEffect } from 'react';
import { AgriProvider, useAgri } from './context/AgriContext';
import ToastContainer from './components/ToastContainer';

import TopNav from './components/TopNav';
import StepNavigator from './components/StepNavigator';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import Step01Landing from './screens/Step01Landing';
import Step02Login from './screens/Step02Login';
import Step03FarmerDashboard from './screens/Step03FarmerDashboard';
import Step04PriceDiscovery from './screens/Step04PriceDiscovery';
import Step05CreateLot from './screens/Step05CreateLot';
import Step06AIGrading from './screens/Step06AIGrading';
import Step07Marketplace from './screens/Step07Marketplace';
import Step08OfferEscrow from './screens/Step08OfferEscrow';
import Step09StorageSubsidy from './screens/Step09StorageSubsidy';
import Step10Grievance from './screens/Step10Grievance';
import Step11FarmerProfile from './screens/Step11FarmerProfile';
import Step12APMCOfficer from './screens/Step12APMCOfficer';
import Step12DisputeCaseStudy from './screens/Step12DisputeCaseStudy';
import Step13BuyerDossier from './screens/Step13BuyerDossier';
import Step14ProduceHistory from './screens/Step14ProduceHistory';
import Step16ByProducts from './screens/Step16ByProducts';
import Step17DriverPortal from './screens/Step17DriverPortal';
import Step17FarmerTransport from './screens/Step17FarmerTransport';
import Step18DigitalPooling from './screens/Step18DigitalPooling';
import Step19DeliveriesDispatch from './screens/Step19DeliveriesDispatch';
import AdminPortal from './screens/admin/AdminPortal';
import Step22FieldAgentPortal from './screens/agent/Step22FieldAgentPortal';
import Step23ByProductBuyerPortal from './screens/buyer/Step23ByProductBuyerPortal';
import Step24ByProductBuyerLogin from './screens/buyer/Step24ByProductBuyerLogin';

function MainApp() {
  const { authUser, toasts, removeToast, switchRole, lang, setLang } = useAgri();
  const [currentStep, setStep] = useState(1);
  const [currentRole, setRole] = useState('farmer'); // 'farmer' | 'apmc' | 'driver' | 'admin' | 'agent'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [driverTab, setDriverTab] = useState('home');
  const [buyerTab, setBuyerTab] = useState('lots');
  const [byProductTab, setByProductTab] = useState('listings');

  // Helper functions for direct portal switching
  const openDriverPortal = (tab = 'home') => {
    if (switchRole) switchRole('driver');
    setRole('driver');
    setStep(20);
    setDriverTab(tab);
  };

  const openFarmerTransport = () => {
    if (switchRole) switchRole('farmer');
    setRole('farmer');
    setStep(17);
  };

  const openFarmerPortal = () => {
    if (switchRole) switchRole('farmer');
    setRole('farmer');
    setStep(3);
  };

  const openBuyerDesk = () => {
    if (switchRole) switchRole('buyer');
    setRole('apmc');
    setStep(7);
  };

  const openByProductBuyerPortal = () => {
    if (switchRole) switchRole('buyer');
    setRole('apmc');
    setStep(23);
    setByProductTab('listings');
  };

  const openAdminPortal = () => {
    if (switchRole) switchRole('admin');
    setRole('admin');
    setStep(21);
  };

  const openFieldAgentPortal = () => {
    if (switchRole) switchRole('agent');
    setRole('agent');
    setStep(22);
  };

  // Automatically route user upon authentication or logout with strict role guards
  useEffect(() => {
    // If the user is on Landing (step 1) or explicitly visits Sign In / Login (step 2), NEVER redirect them away!
    if (currentStep === 1 || currentStep === 2) {
      return;
    }

    if (authUser) {
      if (authUser.role === 'farmer') {
        // If user explicitly navigated to driver console, allow it
        if (currentRole !== 'driver') {
          setRole('farmer');
        }
        const buyerOnlySteps = [7, 12, 13, 14, 15, 23];
        if (buyerOnlySteps.includes(currentStep)) {
          setStep(3); // Farmer Dashboard
        }
      } else if (authUser.role === 'driver') {
        if (currentRole !== 'driver' && currentRole !== 'admin') {
          setRole('driver');
        }
        if (currentStep !== 10 && currentStep !== 17 && currentStep !== 20 && currentStep !== 21 && currentStep !== 22) {
          setStep(20); // Driver Portal
          setDriverTab('home');
        }
      } else if (authUser.role === 'buyer') {
        if (currentRole !== 'apmc') {
          setRole('apmc');
        }
        const farmerOnlySteps = [3, 5, 6, 9, 11, 16];
        if (farmerOnlySteps.includes(currentStep)) {
          setStep(7); // Buyer Marketplace / Procurement Desk
        }
      } else if (authUser.role === 'agent' || authUser.role === 'field_agent') {
        if (currentRole !== 'agent') {
          setRole('agent');
        }
        if (currentStep !== 22 && currentStep !== 2) {
          setStep(22); // Field Agent Portal
        }
      } else if (authUser.role === 'admin') {
        if (currentRole !== 'admin') {
          setRole('admin');
        }
        if (currentStep !== 21 && currentStep !== 2) {
          setStep(21); // Admin Portal
        }
      }
    } else {
      if (currentStep > 2 && currentStep !== 17 && currentStep !== 20 && currentStep !== 21 && currentStep !== 22) {
        setStep(1); // Return to Public Landing Page
      }
    }
  }, [authUser, currentStep]);

  // Helper to render active screen with strict role isolation guards
  const renderScreen = () => {
    // Step 2 is ALWAYS the Sign In / Login screen, accessible to anyone at any time
    if (currentStep === 2) {
      return (
        <Step02Login 
          setStep={setStep} 
          setTerminal={setRole} 
          setRole={setRole} 
          lang={lang} 
          setLang={setLang} 
          openAdminPortal={openAdminPortal}
          openFieldAgentPortal={openFieldAgentPortal}
        />
      );
    }

    // Direct check: Step 22 is ALWAYS the Field Agent Portal
    if (currentStep === 22 || ((currentRole === 'agent' || currentRole === 'field_agent') && currentStep !== 2)) {
      return <Step22FieldAgentPortal setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
    }

    // Direct check: Step 21 is ALWAYS the APMC Regulatory Admin Portal
    if (currentStep === 21 || (currentRole === 'admin' && currentStep !== 2)) {
      return <AdminPortal setStep={setStep} setRole={setRole} lang={lang} />;
    }

    // Direct check: Step 20 is ALWAYS the 9-Tab Driver Console
    if (currentStep === 20 || (currentRole === 'driver' && currentStep !== 10 && currentStep !== 2 && currentStep !== 17)) {
      return (
        <Step17DriverPortal 
          setStep={setStep} 
          setTerminal={setRole} 
          lang={lang} 
          driverTab={driverTab} 
          setDriverTab={setDriverTab} 
          onSwitchToFarmer={openFarmerTransport}
        />
      );
    }

    // If not logged in, allow Landing (1) or Farmer Transport (17)
    if (!authUser) {
      if (currentStep === 17) {
        return (
          <Step17FarmerTransport 
            setStep={setStep} 
            setTerminal={setRole} 
            lang={lang}
            onOpenDriverPortal={() => openDriverPortal('home')}
          />
        );
      }
      return (
        <Step01Landing 
          setStep={setStep} 
          setTerminal={setRole} 
          setRole={setRole} 
          lang={lang} 
          openAdminPortal={openAdminPortal}
          openFieldAgentPortal={openFieldAgentPortal}
        />
      );
    }

    // Role-based route guards for logged-in sessions
    if (authUser.role === 'farmer' && currentRole !== 'driver') {
      const buyerOnlySteps = [7, 12, 13, 15];
      if (buyerOnlySteps.includes(currentStep)) {
        return <Step03FarmerDashboard setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
      }
    } else if (authUser.role === 'buyer') {
      const farmerOnlySteps = [3, 5, 6, 9, 11, 16];
      if (farmerOnlySteps.includes(currentStep)) {
        return <Step07Marketplace setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} buyerTab={buyerTab} setBuyerTab={setBuyerTab} />;
      }
    }

    switch (currentStep) {
      case 1:
        return <Step01Landing setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} openAdminPortal={openAdminPortal} openFieldAgentPortal={openFieldAgentPortal} />;
      case 2:
        return <Step02Login setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} setLang={setLang} openAdminPortal={openAdminPortal} openFieldAgentPortal={openFieldAgentPortal} />;
      case 3:
        return <Step03FarmerDashboard setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
      case 4:
        return <Step04PriceDiscovery setStep={setStep} setTerminal={setRole} currentRole={currentRole} activeTerminal={currentRole} lang={lang} />;
      case 5:
        return <Step05CreateLot setStep={setStep} lang={lang} />;
      case 6:
        return <Step06AIGrading setStep={setStep} lang={lang} />;
      case 7:
        return <Step07Marketplace setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} buyerTab={buyerTab} setBuyerTab={setBuyerTab} />;
      case 8:
        return <Step08OfferEscrow setStep={setStep} setTerminal={setRole} currentRole={currentRole} lang={lang} />;
      case 9:
        return <Step09StorageSubsidy setStep={setStep} lang={lang} />;
      case 10:
        return <Step10Grievance setStep={setStep} lang={lang} />;
      case 11:
        return <Step11FarmerProfile setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
      case 12:
        return <Step12APMCOfficer setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
      case 13:
        return <Step13BuyerDossier setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />;
      case 14:
        return (authUser?.role === 'buyer' || currentRole === 'apmc')
          ? <Step07Marketplace setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} buyerTab="history" setBuyerTab={setBuyerTab} />
          : <Step14ProduceHistory setStep={setStep} setTerminal={setRole} lang={lang} />;
      case 15:
        return <Step12DisputeCaseStudy setStep={setStep} setTerminal={setRole} lang={lang} />;
      case 16:
        return <Step16ByProducts setStep={setStep} lang={lang} />;
      case 17:
        return (
          <Step17FarmerTransport 
            setStep={setStep} 
            setTerminal={setRole} 
            lang={lang}
            onOpenDriverPortal={() => openDriverPortal('home')}
          />
        );
      case 18:
        return <Step18DigitalPooling setStep={setStep} setTerminal={setRole} lang={lang} />;
      case 19:
        return <Step19DeliveriesDispatch setStep={setStep} setTerminal={setRole} lang={lang} />;
      case 20:
        return (
          <Step17DriverPortal 
            setStep={setStep} 
            setTerminal={setRole} 
            lang={lang} 
            driverTab={driverTab} 
            setDriverTab={setDriverTab}
            onSwitchToFarmer={openFarmerTransport}
          />
        );
      case 21:
        return (
          <AdminPortal 
            setStep={setStep} 
            setRole={setRole} 
            lang={lang} 
          />
        );
      case 22:
        return (
          <Step22FieldAgentPortal 
            setStep={setStep} 
            setTerminal={setRole} 
            setRole={setRole} 
            lang={lang} 
          />
        );
      case 23:
        return (
          <Step23ByProductBuyerPortal 
            setStep={setStep} 
            setTerminal={setRole} 
            setRole={setRole} 
            lang={lang} 
            byProductTab={byProductTab}
            setByProductTab={setByProductTab}
          />
        );
      case 24:
        return (
          <Step24ByProductBuyerLogin 
            setStep={setStep} 
            setTerminal={setRole} 
            setRole={setRole} 
            lang={lang} 
          />
        );
      default:
        if (authUser?.role === 'agent' || currentRole === 'agent' || currentRole === 'field_agent') {
          return (
            <Step22FieldAgentPortal 
              setStep={setStep} 
              setTerminal={setRole} 
              setRole={setRole} 
              lang={lang} 
            />
          );
        }
        if (authUser?.role === 'admin' || currentRole === 'admin') {
          return (
            <AdminPortal 
              setStep={setStep} 
              setRole={setRole} 
              lang={lang} 
            />
          );
        }
        if (authUser?.role === 'driver' || currentRole === 'driver') {
          return (
            <Step17DriverPortal 
              setStep={setStep} 
              setTerminal={setRole} 
              lang={lang} 
              driverTab={driverTab} 
              setDriverTab={setDriverTab}
              onSwitchToFarmer={openFarmerTransport}
            />
          );
        }
        return authUser?.role === 'farmer' 
          ? <Step03FarmerDashboard setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} />
          : <Step07Marketplace setStep={setStep} setTerminal={setRole} setRole={setRole} lang={lang} buyerTab={buyerTab} setBuyerTab={setBuyerTab} />;
    }
  };

  const isPublicView = currentStep <= 2 || !authUser;
  const isAdminPortal = currentStep === 21 || currentRole === 'admin' || authUser?.role === 'admin';
  const isFieldAgentPortal = currentStep === 22 || currentRole === 'agent' || currentRole === 'field_agent' || authUser?.role === 'agent';
  const isByProductPortal = currentStep === 23;
  const isFarmerPortal = !isPublicView && !isAdminPortal && !isFieldAgentPortal && !isByProductPortal && (currentRole === 'farmer' || authUser?.role === 'farmer') && currentRole !== 'driver' && currentStep !== 20;
  const isDriverPortal = !isPublicView && !isAdminPortal && !isFieldAgentPortal && !isByProductPortal && (currentStep === 20 || currentRole === 'driver' || (authUser?.role === 'driver' && currentRole !== 'farmer'));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Persistent Top Navigation Bar */}
      <TopNav 
        activeTerminal={currentRole} 
        setTerminal={setRole}
        currentStep={currentStep} 
        setStep={setStep} 
        lang={lang} 
        setLang={setLang}
        driverTab={driverTab}
        setDriverTab={setDriverTab}
        openDriverPortal={openDriverPortal}
        openFarmerPortal={openFarmerPortal}
        openBuyerDesk={openBuyerDesk}
        openByProductBuyerPortal={openByProductBuyerPortal}
        openAdminPortal={openAdminPortal}
        openFieldAgentPortal={openFieldAgentPortal}
      />

      {/* Step Navigator Bar (completely removed in the farmer, driver, field agent, admin & by-product portals) */}
      {!isPublicView && !isFarmerPortal && !isDriverPortal && !isAdminPortal && !isFieldAgentPortal && !isByProductPortal && (
        <StepNavigator 
          currentStep={currentStep} 
          setStep={setStep} 
        />
      )}

      {/* Main Content Layout with Sidebar */}
      <div style={{ display: 'flex', flex: 1, minWidth: 0, width: '100%' }}>
        {/* Left Sidebar shown only when authenticated and inside standard farmer/buyer dashboard screens */}
        {!isPublicView && !isAdminPortal && !isFieldAgentPortal && !isByProductPortal && sidebarOpen && (
          <Sidebar 
            activeTerminal={currentRole}
            setTerminal={setRole}
            currentStep={currentStep}
            setStep={setStep}
            lang={lang}
            driverTab={driverTab}
            setDriverTab={setDriverTab}
            buyerTab={buyerTab}
            setBuyerTab={setBuyerTab}
            byProductTab={byProductTab}
            setByProductTab={setByProductTab}
            openDriverPortal={openDriverPortal}
            openFarmerTransport={openFarmerTransport}
            openAdminPortal={openAdminPortal}
          />
        )}

        {/* Main Content Area */}
        <main style={{ 
          flex: 1, 
          minWidth: 0, 
          width: '100%',
          padding: (isAdminPortal || isFieldAgentPortal || isByProductPortal) ? 0 : isPublicView ? (currentStep === 1 ? '24px 28px 60px' : '20px 24px 60px') : '24px 32px 60px',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            width: '100%',
            maxWidth: (isAdminPortal || isFieldAgentPortal || isByProductPortal) ? '100%' : isPublicView && currentStep === 2 ? 880 : 1600, 
            margin: (isAdminPortal || isFieldAgentPortal || isByProductPortal) ? 0 : '0 auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {renderScreen()}
          </div>
        </main>
      </div>

      {/* Footer */}
      {!isAdminPortal && !isFieldAgentPortal && !isByProductPortal && <Footer lang={lang} setStep={setStep} />}
    </div>
  );
}

export default function App() {
  return (
    <AgriProvider>
      <MainApp />
    </AgriProvider>
  );
}
