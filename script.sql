-- Вставляем данные в таблицу Types
select * from CourseTypes

-- Вставляем данные в таблицу CourseTypes
INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Веб-разработка', 'Курсы, связанные с технологиями веб-разработки, такими как HTML, CSS, JavaScript, а также фреймворками типа React или Angular.', 'Включает практические проекты и задания.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Разработка мобильных приложений', 'Курсы по разработке мобильных приложений для платформ iOS и Android, включая технологии типа Swift, Kotlin и React Native.', 'Фокусируется на создании мобильных приложений для смартфонов и планшетов.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Data Science', 'Курсы, сосредоточенные на анализе данных, машинном обучении и статистике с использованием языков программирования типа Python и R.', 'Включает практические упражнения и реальные наборы данных для анализа.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Кибербезопасность', 'Курсы по темам, связанным с кибербезопасностью, включая сетевую безопасность, этический хакинг и криптографию.', 'Включает лабораторные работы и симуляции для демонстрации уязвимостей и методов защиты.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Game Development', 'Курсы по созданию видеоигр с использованием игровых движков типа Unity или Unreal Engine, а также языков программирования типа C# или C++.', 'Охватывает как 2D, так и 3D разработку игр, включая принципы гейм-дизайна.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Blockchain Разработка ', 'Курсы, сосредоточенные на технологии блокчейн, включая разработку смарт-контрактов, децентрализованные приложения (DApps) и криптовалюту.', 'Исследует основы блокчейна и его применение в различных отраслях.');

select * from Status
-- Вставляем данные в таблицу Status
INSERT INTO Status (status_name) VALUES ('finished');
INSERT INTO Status (status_name) VALUES ('inproc');
INSERT INTO Status (status_name) VALUES ('notabl');
INSERT INTO Status (status_name) VALUES ('ok');

select * from Courses
-- Вставляем данные в таблицу Courses
INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Основы веб-разработки', 'Курс предоставляет введение в основные концепции веб-разработки.', 10, 1, 'Необходимо иметь базовые знания HTML и CSS.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('JavaScript для начинающих', 'Курс охватывает основы JavaScript и его применение в веб-разработке.', 15, 1, 'Предварительные знания HTML и CSS рекомендуются.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Введение в Python', 'Курс о введении в язык программирования Python и его основные концепции.', 20, 3, 'Не требует предварительных знаний.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Основы алгоритмов и структур данных', 'Курс о фундаментальных алгоритмах и структурах данных.', 25, 4, 'Рекомендуется иметь базовые знания в программировании.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Разработка мобильных приложений на Android', 'Курс о создании мобильных приложений для платформы Android с использованием Java и Android SDK.', 30, 2, 'Требуются базовые знания Java.');

select * from Users
-- Вставляем данные в таблицу Statistics
INSERT INTO UserStatistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (1, 1, 1, '2024-01-01', '2024-01-10');

INSERT INTO UserStatistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (1, 2, 2, '2024-02-01', NULL);

INSERT INTO Statistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (2, 1, 3, '2024-03-01', '2024-03-05');
