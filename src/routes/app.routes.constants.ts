export enum ERouteConstans {
    //Авторизация:
    LOGIN = 'login',
    //Сделал сразу чтоб потом вдруг если потребуется уже имелись
    FORGOT_PASSWORD = 'forgot-password',
    AUTH = 'auth',
    MAIN = '',
    //путь если вдруг не понятный путь
    WILDCARD = '**',

    //Пути для страниц
    ADMIN_PANEL = 'admin-panel',
    USER_PANEL = 'user-panel',
    OFFICE_PANEL = 'office-panel',
    SERVICES_PANEL = 'services-panel',
    WORK_PANEL = 'work-panel',
    CLIENT_PANEL ='client-panel'

}