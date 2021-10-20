import { Layout } from 'app/layout/layout.types';

// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Theme = 'default' | string;
export type Common = string[]; // Common modules to enable

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface AppConfig
{
    layout: Layout;
    scheme: Scheme;
    theme: Theme;
    common: Common;
    showSettings: boolean;
    showFooter: boolean;
    showHeader: boolean;
}

/**
 * Default configuration for the entire application. This object is used by
 * FuseConfigService to set the default configuration.
 *
 * If you need to store global configuration for your app, you can use this
 * object to set the defaults. To access, update and reset the config, use
 * FuseConfigService and its methods.
 */
export const appConfig: AppConfig = {
    layout: 'classic',
    scheme: 'auto',
    theme : 'default',
    common: ['languages', 'fullscreen', 'messages', 'notifications', 'search', 'shortcuts', 'user'],
    showSettings: true,
    showFooter: true,
    showHeader: true,
};
