drop schema Trackr;

create schema Trackr;

use Trackr;

create table User (
	UserID varchar(36) primary key,
    Email varchar(255) unique,
    Password varchar(255),
    FullName varchar(255)
);

create table Status (
	StatusID int primary key,
    Name varchar(255)
);

create table Job (
	JobID varchar(36) primary key,
    Role varchar(255),
    Company varchar(255),
    DateApplied date,
    Location varchar(255),
    StatusID int not null,
    foreign key (StatusID) references Status(StatusID)
);