CREATE TABLE organization (
	org_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
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

INSERT INTO project_categories (cart_id, project_id) VALUES (1,1);
INSERT INTO project_categories (cart_id, project_id) VALUES (3,2);
INSERT INTO project_categories (cart_id, project_id) VALUES (2,3);