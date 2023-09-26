INSERT INTO department (name)
VALUES 
("Publishing"),
("Printing"),
("Talent Aquisition"),
("Accounting"),
("Public Relations");



INSERT INTO role (title, salary, department_id )  
VALUES
("Editor in Chief", 150000, 1),
("Printing Press Operator", 85000, 2),
("Recruiter", 100000, 3),
("Accounting Clerk", 90000,4),
("Communications Specialist", 110000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Tina","Brown",1,NULL),
("John", "Printerman",2,1),
("Eva", "Accuier",3,NULL),
("William", "Counterman",4,NULL),
("Sarah", "Talkingston",5,1);

