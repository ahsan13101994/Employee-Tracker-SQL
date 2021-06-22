USE companyDB

-- DEPARTMENTS
INSERT INTO department (name)
VALUES 
("Strategy"), 
("Marketing"),
("Finance"), 
("Human Resources"), 
("Information Technology"),
("Board of Directors") 
("Operations");

SELECT * FROM department;


-- ROLES
INSERT INTO role (title, salary, department_id)
VALUES 
("Lead Software Project Manager", 180000.00, 1),
("Software Engineer", 120000.00, 5),
("Accountant", 70000.00, 3),
("HR Associate", 90000.00, 4),
("Intern", 15000.00, 5),
("Marketing Representative", 60000.00, 2);

SELECT * FROM role;


-- EMPLOYEES

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Robin", "Woods", 1),
("Angela", "Hilton", 4),
("Derek", "Brown", 3),
("John", "Smith", 5);
("Raja", "Kapoor", 2);
("Sohail", "Shah", 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Pasha", "Koele", 1, 1),
("Kale", "Halpert", 2, 1),


SELECT * FROM employee;