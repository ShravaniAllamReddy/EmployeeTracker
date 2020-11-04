INSERT INTO department(name)
VALUES("Engineering"),("HR");

INSERT INTO role( title, salary, department_id)
VALUES("Software Developer", 3200.00, 1),("Intern", 2300.00, 2);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES("shravani", "allam", 1, 2),("sweety", "allam", 2, 1);

select * from employee;

select * from department;

select * from role;

-- View All Employees 
SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, concat( manager.first_name," ",manager.last_name ) Manager
FROM 
employee e
left join role r
on  e.role_id = r.id
left join department d 
on r.department_id = d.id
left join employee manager on e.manager_id = manager.id;

-- Employees who are managers using self join
SELECT  distinct concat(m.first_name," ",m.last_name) Manager, m.id
FROM employee e, employee m WHERE e.manager_id = m.id;

-- View All Employees by department_name
SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department , r.salary, e.manager_id
FROM 
employee AS e
join role AS r
on  e.role_id = r.id
join department as d 
on r.department_id = d.id
where d.name = "Engineering";

-- Update Employee Role
UPDATE role R
join employee E
ON E.role_id = R.id
SET R.title = "Intern"
WHERE E.id = 1;

-- Total Budget by department
SELECT  d.name AS department , SUM(r.salary) as totalbudgetbydept
FROM 
employee AS e
join role AS r
on  e.role_id = r.id
join department as d 
on r.department_id = d.id
where d.name = "accounts" 
