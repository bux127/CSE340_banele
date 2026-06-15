CREATE TABLE organization (
	org_id SERIAL PRIMARY KEY,
	organization_name VARCHAR(50) NOT NULL,
	description VARCHAR(200) NOT NULL,
	email VARCHAR(100) NOT NULL,
	logo_name VARCHAR(100) NOT NULL
);

INSERT INTO organization (name, description, email, logo_name)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE categories (
	cart_id SERIAL PRIMARY KEY,
	name VARCHAR(90) NOT NULL
);

CREATE TABLE projects (
	project_id SERIAL PRIMARY KEY,
	org_id INT,
	title VARCHAR(60),
	description VARCHAR(200)
	date DATE,
	location VARCHAR(30),
	FOREIGN KEY (org_id) REFERENCES organization(org_id);
);

INSERT INTO projects (org_id, title, description, location, date)
VALUES (1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'New York Park', '2026-05-13'),
       (2, 'Food Drive', 'Help collect and distribute food to those in need.', 'Church', '2026-05-16'),
       (3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'BYUI', '2026-05-15'),
       (1, 'Senior Center Visit', 'Spend time playing games and chatting with elderly residents.', 'Sunset Care Home', '2026-05-18'),
       (2, 'Beach Restoration', 'Remove plastic waste and restore natural sand dunes.', 'Coastal Marina', '2026-05-20'),
       (3, 'Animal Shelter Help', 'Walk dogs, clean cages, and socialize rescue animals.', 'Paws & Claws Shelter', '2026-05-23'),
       (1, 'Tree Planting Initiative', 'Plant native trees to help increase urban canopy cover.', 'Oakridge Forest Park', '2026-05-25'),
       (2, 'Blood Donation Drive', 'Assist with registration and support local blood donors.', 'Red Cross Center', '2026-05-27'),
       (3, 'Library Book Sorting', 'Organize inventory and repair damaged children books.', 'City Public Library', '2026-05-30'),
       (1, 'Soup Kitchen Shift', 'Prepare, cook, and serve hot meals to community members.', 'Downtown Mission', '2026-06-01'),
       (2, 'Community Garden Setup', 'Build raised beds and plant seasonal vegetable seeds.', 'Green Thumb Plot', '2026-06-03'),
       (3, 'Clothing Donation Sort', 'Inspect, fold, and organize winter gear for distributions.', 'Thrift Outreach', '2026-06-06'),
       (1, 'Trail Maintenance Day', 'Clear overgrown brush and fix signs on hiking routes.', 'Canyon Nature Trail', '2026-06-08'),
       (2, 'Toy Repair Workshop', 'Fix and sanitize donated toys for holiday distributions.', 'Kids First Warehouse', '2026-06-11'),
       (3, 'School Supply Packing', 'Fill backpacks with notebooks and pens for students.', 'Youth First Center', '2026-06-13')
;

INSERT INTO categories (name) VALUES
('community service'),
('educational'),
('health and wellness');

INSERT INTO projects (name, description) VALUES
('park cleanup', 'Join us to clean up local parks and make them beautiful!'),
('food drive', 'Help collect and distribute food to those in need.'),
('community tutoring', 'Volunteer to tutor students in various subjects.');

CREATE TABLE project_categories(
	cart_id INT,
	project_id INT,
	PRIMARY KEY (cart_id, project_id),
	FOREIGN KEY (cart_id) REFERENCES categories (cart_id),
    FOREIGN KEY (project_id) REFERENCES projects (project_id)
);

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    cart_id INT NOT NULL,
    	
    PRIMARY KEY (project_id, cart_id), 
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (category_id) REFERENCES categories(cart_id) 
);

INSERT INTO project_categories (project_id, category_id) VALUES

(1, 3), 
(2, 1), 
(3, 3), 
(4, 2), 
(5, 2), 

(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1), 

(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2);