'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, BrainCircuit, Images, Plus, ChevronLeft, ChevronRight, Heart, LayoutDashboard } from 'lucide-react';
import { FaXTwitter, FaDiscord, FaYoutube } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Job', href: '/jobs/new', icon: Plus },
    { name: 'Training Queue', href: '/jobs', icon: BrainCircuit },
    { name: 'Datasets', href: '/datasets', icon: Images },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const socialLinks = [
    { name: 'Discord', href: 'https://discord.gg/VXmU2f5WEU', icon: FaDiscord },
    { name: 'YouTube', href: 'https://www.youtube.com/@ostrisai', icon: FaYoutube },
    { name: 'X', href: 'https://x.com/ostrisai', icon: FaXTwitter },
  ];

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-screen bg-zinc-950 border-r border-zinc-800 text-zinc-100 relative z-20 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-zinc-800/50">
        <div className="flex items-center overflow-hidden whitespace-nowrap w-full">
           <img src="/ostris_logo.png" alt="Logo" className="w-8 h-8 min-w-[32px] rounded-lg object-contain" />
           <AnimatePresence mode="wait">
             {!isCollapsed && (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 transition={{ duration: 0.2 }}
                 className="ml-3 font-bold text-lg tracking-tight flex items-center"
               >
                 <span className="text-zinc-100">Ostris</span>
                 <span className="text-primary-500 ml-1">AI</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 font-medium'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={classNames(
                  'w-5 h-5 min-w-[20px] transition-colors',
                  isActive ? 'text-primary-500' : 'text-zinc-500 group-hover:text-zinc-300'
                )}
              />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-zinc-400 hover:text-white transition-colors shadow-md z-30 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Footer / Support */}
      <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/30">
        <a
          href="https://ostris.com/support"
          target="_blank"
          rel="noreferrer"
          className={classNames(
            "flex items-center p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group mb-2",
            isCollapsed ? "justify-center" : ""
          )}
          title="Support AI Toolkit"
        >
          <div className="w-8 h-8 min-w-[32px] flex items-center justify-center bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
             <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 overflow-hidden"
              >
                 <p className="text-sm font-medium text-zinc-200 whitespace-nowrap">Support Project</p>
                 <p className="text-xs text-zinc-500 whitespace-nowrap">Donate via Patreon</p>
              </motion.div>
            )}
          </AnimatePresence>
        </a>

        {/* Socials Grid */}
        <div className={classNames("grid gap-2 transition-all duration-300", isCollapsed ? "grid-cols-1" : "grid-cols-3")}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 hover:text-white text-zinc-400 transition-all"
              title={social.name}
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
