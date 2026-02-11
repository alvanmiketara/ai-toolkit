import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import classNames from 'classnames';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, collapsible, defaultOpen, className }) => {
  if (collapsible) {
    return (
      <Disclosure as="section" className={classNames("space-y-2 px-6 py-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl transition-all duration-300 hover:border-zinc-700/80 shadow-sm", className)} defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <DisclosureButton className="w-full text-left flex items-center justify-between group focus:outline-none">
              <div className="flex-1">
                {title && (
                  <h2 className={classNames('text-lg font-semibold tracking-tight text-zinc-400 group-hover:text-zinc-200 transition-colors', { 'mb-0': !open })}>
                    {title}
                  </h2>
                )}
              </div>
              <FaChevronDown className={classNames("ml-2 text-zinc-600 group-hover:text-zinc-400 transition-transform duration-300", open ? 'rotate-180' : '')} />
            </DisclosureButton>
            <DisclosurePanel>
               <div className="pt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                 {children ?? null}
               </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    );
  }
  return (
    <section className={classNames("px-6 py-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl transition-all duration-300 hover:border-zinc-700/80 shadow-sm", className)}>
      {title && <h2 className="text-lg mb-4 font-semibold tracking-tight text-zinc-300">{title}</h2>}
      {children ?? null}
    </section>
  );
};

export default Card;
