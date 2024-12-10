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

    //Пути для пользователя
    USER_PANEL = 'user-panel',
    USER_LIST = 'user-list',
    USER_DEPARTMENT = 'user-department',
    USER_ROLE = 'user-role',

    //Пути для офиса
    OFFICE_PANEL = 'office-panel',
    CABINET_PANEL = 'cabinet-panel',


    //Пути для услуг
    SERVICES_PANEL = 'services-panel',

    //Рабочая панель
    WORK_PANEL = 'work-panel',

    //КЛиентская часть
    CLIENT_PANEL ='client-panel'

}