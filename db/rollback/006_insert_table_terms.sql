delete from readings where term=(select id from terms where name='ubuntu');
delete from Terms where name = 'ubuntu';

delete from readings where term=(select id from terms where name='GUI');
delete from Terms where name = 'GUI';

delete from readings where term=(select id from terms where name='Debian');
delete from Terms where name = 'Debian';

delete from readings where term=(select id from terms where name='WSDL');
delete from Terms where name = 'WSDL';

delete from readings where term=(select id from terms where name='Adobe');
delete from Terms where name = 'Adobe';

delete from readings where term=(select id from terms where name='Youtube');
delete from Terms where name = 'Youtube';

delete from readings where term=(select id from terms where name='AJAX');
delete from Terms where name = 'AJAX';

delete from readings where term=(select id from terms where name='App');
delete from Terms where name = 'App';