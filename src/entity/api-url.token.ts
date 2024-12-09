import {  InjectionToken, Provider } from '@angular/core';
import { environment } from '../../environment/environment';

export interface IApiUrls {
    apiService: string;
    authService: string;
}

export const API_URLS = new InjectionToken<IApiUrls>('API_URLS');

export const provideApiUrls: () => Provider = () => {
    return {
        provide: API_URLS,
        useValue: {
            apiService: environment.apiService,
            authService: environment.authService,
        },
    };
};