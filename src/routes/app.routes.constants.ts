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
    USER_LIST = 'list',
    USER_DEPARTMENT = 'department',
    USER_ROLE = 'role',
    USER_PAGE = 'detail',

    //Пути для офиса
    OFFICE_PANEL = 'office-panel',
    CABINET_PANEL = 'cabinet',
    OFFICE_LIST = 'list',


    //Пути для услуг
    SERVICES_PANEL = 'services-panel',
    SERVICE_LIST = 'list',
    SERVICE_PAGE =  'detail',
    SERVICE_PRODUCT = 'product',
    SERVICE_PRODUCT_SALE = 'product-sale',

    //Рабочая панель
    WORK_PANEL = 'work-panel',

    //КЛиентская часть
    CLIENT_PANEL ='client-panel'

}