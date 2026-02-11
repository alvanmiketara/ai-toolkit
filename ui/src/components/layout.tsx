import classNames from 'classnames';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const TopBar: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'sticky top-0 z-10 w-full h-16 flex items-center px-6',
        'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50',
        className,
      )}
    >
      <div className="flex items-center w-full max-w-[1600px] mx-auto text-lg font-medium text-zinc-100">
        {children}
      </div>
    </div>
  );
};

export const MainContent: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={classNames('p-6 w-full max-w-[1600px] mx-auto', className)}>
      {children}
    </div>
  );
};
