insert into Terms(name, source, description) values('apache', "http://www.apache.org", 'Apache is a freely available Web server that is distributed under an "open source" license.');
insert into Terms(name, source, description) values('maven', "http://maven.apache.org", "Apache Maven is a software project management and comprehension tool. Maven can manage a project's build, reporting and documentation from a central piece of information.");
insert into Terms(name, source, description) values('nginx', "http://nginx.org", "nginx is an HTTP and reverse proxy server, as well as a mail proxy server, written by Igor Sysoev.");
insert into Terms(name, source, description) values('java', "http://www.java.com", "Java is a programming language originally developed by James Gosling at Sun Microsystems and released in 1995 as a core component of Sun Microsystems' Java platform.");
insert into Terms(name, source, description) values('parameter', "", "In computer programming, a parameter is a special kind of variable, used in a subroutine to refer to one of the pieces of data provided as input to the subroutine.");			
insert into Terms(name, source, description) values('cache', "", "In computer engineering, a cache is a component that transparently stores data so that future requests for that data can be served faster.");
insert into Terms(name, source, description) values('c#', "http://msdn.microsoft.com/en-us/vstudio/hh388566.aspx", "C# is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented, and component-oriented programming disciplines.");
insert into Terms(name, source, description) values('pixel', "", "In digital imaging, a pixel is a single point in a raster image, or the smallest addressable screen element in a display device. It is the smallest unit of picture that can be represented or controlled.");
insert into Terms(name, source, description) values('mockito', "http://code.google.com/p/mockito", 'Mockito is an open source testing framework for Java released under the MIT License. The framework allows the creation of Test Double objects called, "Mock Objects" in automated unit tests.');
insert into Terms(name, source, description) values('firefox', "http://www.mozilla.org", "Mozilla Firefox is a free and open source web browser descended from the Mozilla Application Suite and managed by Mozilla Corporation.");
insert into Terms(name, source, description) values('chrome', "http://www.google.cn/chrome", "Google Chrome is a web browser developed by Google that uses the WebKit layout engine. Google Chrome OS is a Linux-based operating system designed by Google to work exclusively with web applications.");
insert into Terms(name, source, description) values('applet', "", "In computing, an applet is any small application that performs one specific task that runs within the scope of a larger program, often as a plug-in.");
insert into Terms(name, source, description) values('agile', "", "Agile is a group of software development methodologies based on iterative and incremental development, where requirements and solutions evolve through collaboration between self-organizing, cross-functional teams.");
insert into Terms(name, source, description) values('iteration', "", "Iteration in computing is the repetition of a process within a computer program.");
insert into Terms(name, source, description) values('linux', "https://www.linux.com", "Linux is a Unix-like computer operating system assembled under the model of free and open source software development and distribution.");
insert into Terms(name, source, description) values('ubuntu', "http://www.ubuntu.com", "Ubuntu is a computer operating system based on the Debian Linux distribution and distributed as free and open source software, using its own desktop environment.");
insert into Terms(name, source, description) values('chef', "http://www.opscode.com/chef", "Chef is an open-source systems integration framework built specifically for automating the cloud.");	
insert into Terms(name, source, description) values('axure', "http://www.axure.com", "Axure RP is the standard in software prototyping tools and gives you the power to quickly and easily deliver more than UI mockups.");		


insert into pronunciations(symbol, audio, is_correct, term) values("ə'pætʃi", 'apache.mp3', 'true', (select id from terms where name='apache'));
insert into pronunciations(symbol, audio, is_correct, term) values("'meiven", 'maven.mp3', 'true', (select id from terms where name='maven'));
insert into pronunciations(symbol, audio, is_correct, term) values("'endʒin eks", 'nginx.mp3', 'true', (select id from terms where name='nginx'));
insert into pronunciations(symbol, audio, is_correct, term) values("'dʒɑ:və", 'java.mp3', 'true', (select id from terms where name='java'));
insert into pronunciations(symbol, audio, is_correct, term) values("pə'ræmitə", 'parameter.mp3', 'true', (select id from terms where name='parameter'));			
insert into pronunciations(symbol, audio, is_correct, term) values("kæʃ", 'cache.mp3', 'true', (select id from terms where name='cache'));
insert into pronunciations(symbol, audio, is_correct, term) values("si: ʃɑ:p", 'csharp.mp3', 'true', (select id from terms where name='c#'));
insert into pronunciations(symbol, audio, is_correct, term) values("'piksəl", 'pixel.mp3', 'true', (select id from terms where name='pixel'));
insert into pronunciations(symbol, audio, is_correct, term) values("mɔkitɔ", 'mockito.mp3', 'true', (select id from terms where name='mockito'));
insert into pronunciations(symbol, audio, is_correct, term) values("faiefɔ:ks", 'firefox.mp3', 'true', (select id from terms where name='firefox'));
insert into pronunciations(symbol, audio, is_correct, term) values("krəum", 'chrome.mp3', 'true', (select id from terms where name='chrome'));
insert into pronunciations(symbol, audio, is_correct, term) values("æplət", 'applet.mp3', 'true', (select id from terms where name='applet'));
insert into pronunciations(symbol, audio, is_correct, term) values("'ædʒail, 'ædʒəl", 'agile.mp3', 'true', (select id from terms where name='agile'));
insert into pronunciations(symbol, audio, is_correct, term) values(".itə'reiʃən", 'iteration.mp3', 'true', (select id from terms where name='iteration'));
insert into pronunciations(symbol, audio, is_correct, term) values("'linəks, 'linʊks", 'linux.mp3', 'true', (select id from terms where name='linux'));
insert into pronunciations(symbol, audio, is_correct, term) values("ʊ:bʊ:ntʊ:", 'ubuntu.mp3', 'true', (select id from terms where name='ubuntu'));
insert into pronunciations(symbol, audio, is_correct, term) values("ʃef", 'chef.mp3', 'true', (select id from terms where name='chef'));
insert into pronunciations(symbol, audio, is_correct, term) values("æk'ʃuə", 'axure.mp3', 'true', (select id from terms where name='axure'));
                                          
insert into pronunciations(symbol, audio, is_correct, term) values("ə'pʌtʃi", 'apache_wrong1.mp3', 'false', (select id from terms where name='apache'));
insert into pronunciations(symbol, audio, is_correct, term) values("'mʌven", 'maven_wrong1.mp3', 'false', (select id from terms where name='maven'));
insert into pronunciations(symbol, audio, is_correct, term) values("n'ginks", 'nginx_wrong1.mp3', 'false', (select id from terms where name='nginx'));	
insert into pronunciations(symbol, audio, is_correct, term) values("'dʒɑ:vʌ", 'java_wrong1.mp3', 'false', (select id from terms where name='java'));	
insert into pronunciations(symbol, audio, is_correct, term) values("pə'ræmitə", 'parameter_wrong1.mp3', 'false', (select id from terms where name='parameter'));
insert into pronunciations(symbol, audio, is_correct, term) values("kæʃ", 'cache_wrong1.mp3', 'false', (select id from terms where name='cache'));
insert into pronunciations(symbol, audio, is_correct, term) values("si: ʃɑ:p", 'csharp_wrong1.mp3', 'false', (select id from terms where name='c#'));
insert into pronunciations(symbol, audio, is_correct, term) values("'piksəl", 'pixel_wrong1.mp3', 'false', (select id from terms where name='pixel'));
insert into pronunciations(symbol, audio, is_correct, term) values("mɔkitɔ", 'mockito_wrong1.mp3', 'false', (select id from terms where name='mockito'));
insert into pronunciations(symbol, audio, is_correct, term) values("faiefɔ:ks", 'firefox_wrong1.mp3', 'false', (select id from terms where name='firefox'));
insert into pronunciations(symbol, audio, is_correct, term) values("krəum", 'chrome_wrong1.mp3', 'false', (select id from terms where name='chrome'));
insert into pronunciations(symbol, audio, is_correct, term) values("æplət", 'applet_wrong1.mp3', 'false', (select id from terms where name='applet'));
insert into pronunciations(symbol, audio, is_correct, term) values("'ædʒail, 'ædʒəl", 'agile_wrong1.mp3', 'false', (select id from terms where name='agile'));
insert into pronunciations(symbol, audio, is_correct, term) values(".itə'reiʃən", 'iteration_wrong1.mp3', 'false', (select id from terms where name='iteration'));
insert into pronunciations(symbol, audio, is_correct, term) values("'linəks, 'linʊks", 'linux_wrong1.mp3', 'false', (select id from terms where name='linux'));
insert into pronunciations(symbol, audio, is_correct, term) values("ʊ:bʊ:ntʊ:", 'ubuntu_wrong1.mp3', 'false', (select id from terms where name='ubuntu'));
insert into pronunciations(symbol, audio, is_correct, term) values("ʃef", 'chef_wrong1.mp3', 'false', (select id from terms where name='chef'));
insert into pronunciations(symbol, audio, is_correct, term) values("æk'ʃuə", 'axure_wrong1.mp3', 'false', (select id from terms where name='axure'));



