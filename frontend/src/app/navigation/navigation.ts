import { FuseNavigation } from '../../@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Menú',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        icon     : 'apps',
        children : [
            {
                id       : 'dashboards',
                title    : 'Dashboards',
                translate: 'Dashboards',
                type     : 'collapsable',
                icon     : 'dashboard',
                children : [
                    {
                        id   : 'usuario',
                        title: 'Usuario',
                        type : 'item',
                        url  : '/sel-usuario',
                        icon     : 'account_box',
                    }
                ]
            },
           
        ]
    }
];
