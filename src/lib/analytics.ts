/**
 * Analytics event tracking.
 *
 * Uses Google Analytics 4 (gtag) if available,
 * otherwise falls back to console.log in development.
 */

type EventName =
    | 'calculate_clicked'
    | 'country_selected'
    | 'date_range_changed'
    | 'copy_result_clicked'
    | 'export_clicked'
    | 'share_link_clicked';

interface EventParams {
    [key: string]: string | number | boolean | undefined;
}

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

/**
 * Track an analytics event.
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
    // GA4 via gtag
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
        return;
    }

    // Development fallback
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}`, params);
    }
}

/**
 * Track a page view (for SPA navigation).
 */
export function trackPageView(path: string, title: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title,
        });
    }
}
