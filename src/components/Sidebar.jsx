import React from 'react';
import { 
  LayoutDashboard, TrendingUp, PlusCircle, Store, Lock, 
  Warehouse, Scale, User, Building2, BarChart3, AlertTriangle, 
  MapPin, PhoneCall, ShieldCheck, ChevronDown, Sparkles, Recycle,
  Truck, Package, DollarSign, Star, Users, Bell, History, HelpCircle, Clock,
  MessageSquare, CreditCard
} from 'lucide-react';
import { MOCK_FARMER } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';
import { useAgri } from '../context/AgriContext';

export default function Sidebar({ 
  activeTerminal, 
  setTerminal, 
  currentStep, 
  setStep, 
  lang, 
  driverTab = 'home', 
  setDriverTab, 
  buyerTab = 'lots', 
  setBuyerTab, 
  byProductTab = 'listings',
  setByProductTab,
  openDriverPortal, 
  openFarmerTransport, 
  openAdminPortal 
}) {
  const { switchRole, lang: ctxLang } = useAgri();
  const activeLang = ctxLang || lang;
  const isFarmer = activeTerminal === 'farmer';
  const isDriver = activeTerminal === 'driver' || currentStep === 20;
  const isBuyer = !isFarmer && !isDriver;
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // 1. Farmer Navigation (Strictly Farmer-only and Shared tabs)
  const farmerNavItems = [
    { id: 3, label: t.navDashboard || 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 4, label: t.navPrices || 'Live Price Tracking', icon: TrendingUp, badge: 'Agmarknet' },
    { id: 5, label: t.navCreateLot || 'Create Listing', icon: PlusCircle, badge: null },
    { id: 6, label: t.navGrading || 'AI Grading Studio', icon: Sparkles, badge: 'Vision' },
    { id: 18, label: 'Digital Mandi Pooling', icon: Users, badge: 'Pool #04' },
    { id: 8, label: t.navEscrow || 'Offers & Escrow', icon: Lock, badge: '₹2.91L' },
    { id: 19, label: 'Deliveries & Dispatch', icon: Truck, badge: 'Pickup' },
    { id: 9, label: t.navStorage || 'Storage & Subsidies', icon: Warehouse, badge: 'Matched' },
    { id: 16, label: t.navByProducts || 'By-Products & Residue', icon: Recycle, badge: '+₹18k' },
    { id: 10, label: t.navGrievance || 'Grievance Redressal', icon: Scale, badge: '48h SLA' },
    { id: 11, label: t.navProfile || 'Farmer Profile', icon: User, badge: 'Verified' }
  ];

  // 2. Direct-to-Farmer Buyer Navigation (Farmer-centric modules, no By-Product Buyer Portal option)
  const buyerNavItems = [
    { id: 7, tabId: 'lots', label: 'Direct Farmer Marketplace', icon: Store, badge: 'Live Lots' },
    { id: 7, tabId: 'directory', label: 'Farmer Directory & Profiles', icon: Users, badge: '148 Verified' },
    { id: 17, label: t.navTransport || 'Transportation & Fleets', icon: Truck, badge: 'Vahan' },
    { id: 7, tabId: 'pickups', label: 'Farmgate Pickup Scheduling', icon: Truck, badge: '3 Scheduled' },
    { id: 4, label: 'Fair Price Advisor', icon: TrendingUp, badge: 'Agmarknet' },
    { id: 8, label: 'Escrow & Instant Payments', icon: Lock, badge: '100% Direct' },
    { id: 7, tabId: 'ratings', label: 'Trust & Ratings', icon: Star, badge: '4.9 ★' },
    { id: 10, label: 'Grievance Redressal', icon: AlertTriangle, badge: 'Direct Desk' },
    { id: 13, label: 'Verified Buyer Profile', icon: ShieldCheck, badge: 'Verified' },
    { id: 7, tabId: 'history', label: 'Order History', icon: History, badge: 'Log' }
  ];


  // 4. Driver Navigation (Complete 9-Tab Portal Architecture)
  const driverNavItems = [
    { id: 20, tabId: 'home', label: 'Home / Dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { id: 20, tabId: 'available_orders', label: 'Available Orders / Job Requests', icon: Package, badge: '4 New' },
    { id: 20, tabId: 'active_trip', label: 'Active Trip / Ongoing Delivery', icon: Truck, badge: 'Active' },
    { id: 20, tabId: 'trip_history', label: 'Trip History', icon: History, badge: '84 Done' },
    { id: 20, tabId: 'earnings', label: 'Earnings / Payments', icon: DollarSign, badge: '₹8.4k' },
    { id: 20, tabId: 'vehicle_profile', label: 'Vehicle & Profile', icon: ShieldCheck, badge: 'Vahan' },
    { id: 20, tabId: 'trust_reviews', label: 'Trust & Reviews', icon: Star, badge: '4.9 ★' },
    { id: 20, tabId: 'notifications', label: 'Notifications', icon: Bell, badge: '3 New' },
    { id: 20, tabId: 'support', label: 'Support / Help', icon: HelpCircle, badge: 'APMC' }
  ];

  const navItems = isDriver 
    ? driverNavItems 
    : isFarmer 
    ? farmerNavItems 
    : buyerNavItems;

  return (
    <aside style={{ 
      width: 260, minWidth: 260, 
      background: 'rgba(255, 255, 255, 0.78)', 
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.85)', 
      boxShadow: '4px 0 20px -2px rgba(15, 23, 42, 0.03)',
      display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 110px)', position: 'sticky', top: 110 
    }}>
      
      {/* Jurisdiction / Region Selector Box */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)', background: 'rgba(248, 250, 252, 0.65)' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          {isFarmer ? 'APMC JURISDICTION' : isDriver ? 'DRIVER FLEET BASE' : 'DIRECT SOURCING REGION'}
        </div>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.9)', padding: '7px 12px', borderRadius: 10, 
          border: '1px solid rgba(203, 213, 225, 0.8)', 
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <MapPin size={14} style={{ color: isFarmer ? '#15803d' : '#ea580c' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-title)' }}>
              {isFarmer ? 'Nashik Krishi Mandi' : isDriver ? 'Nashik Transport Hub' : 'Nashik & Pune Farmer Belt'}
            </span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = isDriver 
            ? (currentStep === 20 && (driverTab || 'home') === item.tabId)
            : isFarmer
            ? currentStep === item.id
            : isBuyer && item.tabId
            ? (currentStep === 7 && (buyerTab || 'lots') === item.tabId)
            : currentStep === item.id;
          const Icon = item.icon;
          return (
            <button
              key={isDriver ? item.tabId : (item.tabId ? `${item.id}-${item.tabId}` : item.id || item.label)}
              onClick={() => {
                if (isDriver) {
                  setStep(20);
                  if (setDriverTab) setDriverTab(item.tabId);
                } else if (isBuyer) {
                  // Inside Buyer Portal
                  if (item.tabId) {
                    setStep(7);
                    if (setBuyerTab) setBuyerTab(item.tabId);
                  } else {
                    setStep(item.id);
                  }
                } else if (item.isDriverSwitch) {
                  if (openDriverPortal) {
                    openDriverPortal('home');
                  } else {
                    if (switchRole) switchRole('driver');
                    setTerminal('driver');
                    setStep(20);
                    if (setDriverTab) setDriverTab('home');
                  }
                } else if (item.isAdminSwitch) {
                  if (openAdminPortal) {
                    openAdminPortal();
                  } else {
                    if (switchRole) switchRole('admin');
                    setTerminal('admin');
                    setStep(21);
                  }
                } else {
                  setStep(item.id);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: '0.83rem',
                fontWeight: isActive ? 800 : 500,
                background: isActive 
                  ? (isFarmer 
                      ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' 
                      : isDriver 
                      ? 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)' 
                      : 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)')
                  : 'transparent',
                color: isActive ? (isFarmer ? '#15803d' : isDriver ? '#1d4ed8' : '#c2410c') : 'var(--text-main)',
                border: isActive 
                  ? (isFarmer ? '1px solid #a7f3d0' : isDriver ? '1px solid #bfdbfe' : '1px solid #fed7aa') 
                  : '1px solid transparent',
                boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 5px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon size={16} style={{ color: isActive ? (isFarmer ? '#15803d' : isDriver ? '#2563eb' : '#ea580c') : '#64748b' }} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${isActive ? (isFarmer ? 'badge-green' : isDriver ? 'badge-blue' : 'badge-saffron') : 'badge-gray'}`} style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Support Box */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(226, 232, 240, 0.7)', background: 'rgba(248, 250, 252, 0.65)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, 
            background: isDriver ? 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)' : isFarmer ? 'linear-gradient(180deg, #ecfdf5 0%, #dcfce7 100%)' : 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)', 
            color: isDriver ? '#2563eb' : isFarmer ? '#15803d' : '#ea580c', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 800, fontSize: '0.95rem',
            border: isDriver ? '1px solid #bfdbfe' : isFarmer ? '1px solid #bbf7d0' : '1px solid #fed7aa',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.03)'
          }}>
            {isDriver ? '🚚' : isFarmer ? '👨‍🌾' : '🏢'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-title)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {isDriver ? 'Rajesh Patil (MH 15)' : isFarmer ? MOCK_FARMER.name : 'AgroFresh Sourcing'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {isDriver ? 'Vahan Verified • 4.5 MT' : isFarmer ? 'Gut No. 142/B • Verified' : 'Verified Direct Buyer'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: isDriver ? '#2563eb' : isFarmer ? '#15803d' : '#ea580c', fontWeight: 700 }}>
          <PhoneCall size={12} />
          <span>{isDriver ? 'Transporter Helpline: 1800-220-4402' : isFarmer ? 'Kisan Call: 1800-180-1551' : 'Direct Farmer Desk: 1800-120-8040'}</span>
        </div>
      </div>

    </aside>
  );
}
