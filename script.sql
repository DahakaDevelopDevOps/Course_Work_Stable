-- Вставляем данные в таблицу Types
select * from CourseTypes

-- Вставляем данные в таблицу CourseTypes
INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Web Development', 'Courses related to web development technologies such as HTML, CSS, JavaScript, as well as frameworks like React or Angular.', 'Includes practical projects and assignments.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Mobile App Development', 'Courses on mobile app development for iOS and Android platforms, including technologies like Swift, Kotlin, and React Native.', 'Focuses on creating mobile applications for smartphones and tablets.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Data Science', 'Courses focused on data analysis, machine learning, and statistics using programming languages such as Python and R.', 'Includes practical exercises and real data sets for analysis.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Cybersecurity', 'Courses on topics related to cybersecurity, including network security, ethical hacking, and cryptography.', 'Includes lab work and simulations to demonstrate vulnerabilities and protection methods.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Game Development', 'Courses on video game creation using game engines like Unity or Unreal Engine, as well as programming languages like C# or C++.', 'Covers both 2D and 3D game development, including game design principles.');

INSERT INTO CourseTypes (type_name, description, other_details) 
VALUES ('Blockchain Development', 'Courses focused on blockchain technology, including the development of smart contracts, decentralized applications (DApps), and cryptocurrency.', 'Explores blockchain fundamentals and its applications in various industries.');
delete CourseTypes;

INSERT INTO Status (status_name) VALUES ('finished');
INSERT INTO Status (status_name) VALUES ('inproc');
INSERT INTO Status (status_name) VALUES ('notabl');
INSERT INTO Status (status_name) VALUES ('ok');
select * from Users

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Introduction to Web Development', 'The course provides an introduction to the basic concepts of web development.', 10, 13, 'Basic knowledge of HTML and CSS is required.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('JavaScript for Beginners', 'The course covers the basics of JavaScript and its application in web development.', 15, 14, 'Prior knowledge of HTML and CSS is recommended.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Introduction to Python', 'The course introduces the Python programming language and its main concepts.', 20, 15, 'No prior knowledge is required.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Fundamentals of Algorithms and Data Structures', 'The course covers fundamental algorithms and data structures.', 25, 16, 'Basic programming knowledge is recommended.');

INSERT INTO Courses (course_name, description, duration, course_type_id, other_details) 
VALUES ('Android App Development', 'The course covers creating mobile applications for the Android platform using Java and the Android SDK.', 30, 17, 'Basic knowledge of Java is required.');
-- Вставляем данные в таблицу Statistics
INSERT INTO UserStatistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (1, 1, 1, '2024-01-01', '2024-01-10');

INSERT INTO UserStatistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (1, 2, 2, '2024-02-01', NULL);

INSERT INTO Statistics (user_id, course_id, status_id, start_date, end_date) 
VALUES (2, 1, 3, '2024-03-01', '2024-03-05');
