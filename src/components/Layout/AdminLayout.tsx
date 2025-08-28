import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Bot, 
  FileText, 
  Beaker, 
  MessageSquare, 
  Users, 
  Mail,
  Settings,
  LogOut,
  Image,
  Clapperboard
} from 'lucide-react';
import Button from '../UI/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Robots', path: '/robots', icon: Bot },
  { name: 'Banner', path: '/banners', icon: Image },

  { name: 'Blog Posts', path: '/blog', icon: FileText },
  { name: 'Research', path: '/research', icon: Beaker },
  { name: 'Case Study', path: '/Casestudy',   icon: FileText, },
  { name: 'Behind Scenes', path: '/Behindscenes', icon:  Clapperboard, },


    { name: 'Current Projects', path: '/CurrentProjects', icon: Bot },

  { name: 'Testimonials', path: '/testimonials', icon: MessageSquare },
  // { name: 'Partners', path: '/partners', icon: Users },
  { name: 'Buy Quote', path: '/Buy_Robot', icon: FileText },

  { name: 'Rent Quote', path: '/Rent_Robot', icon: FileText },

  { name: 'Leads', path: '/leads', icon: Mail },
  // { name: 'Settings', path: '/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute right-0 top-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent locationPath={location.pathname} closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent locationPath={location.pathname} />
      </div>

      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {navigation.find(nav => nav.path === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-4">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
                <span className="hidden lg:flex lg:items-center text-sm font-semibold text-gray-900">
                  Admin User
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ locationPath, closeSidebar }: { locationPath: string; closeSidebar?: () => void }) {

   const navigate = useNavigate();

 const handleLogout = () => {
    // Clear token / user info from localStorage or sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    // (Optional) clear everything
    // localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center">
          <Bot className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">Fortune</span>
          <span className="ml-1 text-xl font-bold text-blue-500">Admin</span>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = locationPath === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
           <Button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      <LogOut size={18} />
      Logout
    </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
