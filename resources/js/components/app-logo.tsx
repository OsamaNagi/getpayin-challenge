import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                <AppLogoIcon className="text-white fill-current size-5 dark:text-black" />
            </div>
            <div className="grid flex-1 ml-1 text-sm text-left">
                <span className="mb-0.5 truncate leading-none font-semibold">Content Scheduler</span>
            </div>
        </>
    );
}
