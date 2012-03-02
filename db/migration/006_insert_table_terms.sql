insert into Terms(name, source, description) values('ubuntu', "http://www.ubuntu.com", "以桌面应用为主的GNU/Linux操作系统。");
insert into readings(symbol, audio, is_correct, term) values("u:'bu:ntu:", 'ubuntu_wubantu.mp3', 'true', (select id from terms where name='ubuntu'));
insert into readings(symbol, audio, is_correct, term) values("'ju:bu:ntu:", 'ubuntu_youbangtu.mp3', 'false', (select id from terms where name='ubuntu'));

insert into Terms(name, source, description) values('GUI', "", "图形用户界面，是指采用图形方式显示的计算机操作用户界面。");
insert into readings(symbol, audio, is_correct, term) values("'guˌi:", 'gui_guyi.mp3', 'true', (select id from terms where name='GUI'));
insert into readings(symbol, audio, is_correct, term) values("G-U-I", 'gui_zhiyouai.mp3', 'false', (select id from terms where name='GUI'));

insert into Terms(name, source, description) values('Debian', "", "采用GPL协议授权的操作系统，基于Linux内核。");
insert into readings(symbol, audio, is_correct, term) values("'dibi:n", 'debian_dibin.mp3', 'false', (select id from terms where name='Debian'));
insert into readings(symbol, audio, is_correct, term) values("'dəbi:n", 'debian_debin.mp3', 'false', (select id from terms where name='Debian'));
insert into readings(symbol, audio, is_correct, term) values("'dεbi:n", 'debian_daibin.mp3', 'true', (select id from terms where name='Debian'));

insert into Terms(name, source, description) values('WSDL', "", "一门基于XML 的语言，用于描述Web Services 以及如何对它们进行访问。");
insert into readings(symbol, audio, is_correct, term) values("'weisˌdəu:", 'wsdl_weisidou.mp3', 'true', (select id from terms where name='GUI'));
insert into readings(symbol, audio, is_correct, term) values("W-S-D-L", 'wsdl_wsdl.mp3', 'false', (select id from terms where name='GUI'));

insert into Terms(name, source, description) values('Adobe', "", "图形用户界面，是指采用图形方式显示的计算机操作用户界面。");
insert into readings(symbol, audio, is_correct, term) values("ə'dəubi", 'adobe_edoubi.mp3', 'true', (select id from terms where name='Adobe'));
insert into readings(symbol, audio, is_correct, term) values("ə'dəub", 'adobe_edoubo.mp3', 'false', (select id from terms where name='Adobe'));

insert into Terms(name, source, description) values('Youtube', "", "世界上最大的视频分享网站。");
insert into readings(symbol, audio, is_correct, term) values("'ju:tju:b", 'youtube_youtiubo.mp3', 'true', (select id from terms where name='Youtube'));
insert into readings(symbol, audio, is_correct, term) values("ju:'tu:b", 'youtube_youtubo.mp3', 'false', (select id from terms where name='Youtube'));

insert into Terms(name, source, description) values('AJAX', "", "异步JavaScript 及XML，用于创建更好更快以及交互性更强的 Web 应用程序。");
insert into readings(symbol, audio, is_correct, term) values("'eidʒæks", 'ajax_eizhaikes.mp3', 'true', (select id from terms where name='AJAX'));
insert into readings(symbol, audio, is_correct, term) values("ə'dʒæks", 'ajax_ezhaikes.mp3', 'false', (select id from terms where name='AJAX'));
insert into readings(symbol, audio, is_correct, term) values("a'dʒæks", 'ajax_azhaikes.mp3', 'false', (select id from terms where name='AJAX'));
insert into readings(symbol, audio, is_correct, term) values("a'dʒaks", 'ajax_ajiakes.mp3', 'false', (select id from terms where name='AJAX'));

insert into Terms(name, source, description) values('App', "", "应用程序application program的简称。");
insert into readings(symbol, audio, is_correct, term) values("æp", 'app_aipu.mp3', 'true', (select id from terms where name='App'));
insert into readings(symbol, audio, is_correct, term) values("A-P-P", 'app_eipipi.mp3', 'false', (select id from terms where name='App'));
