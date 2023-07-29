INSERT INTO department (department_name)
VALUES ("HR"),
       ("R&D"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("HR Person", 100, 1),
       ("R&D Person", 200, 2),
       ("Sales Person", 300, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL),
       ("Quincy", "Coleman", 2, 1),
       ("James", "Brown", 3, 2);

