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

insert into Status values (0, 'Applied'), (1, 'Interview'), (2, 'Offer'), (3, 'Accepted'), (4, 'Rejected'), (5, 'Declined');

create table Job (
	JobID varchar(36) primary key,
    UserID varchar(36) not null,
    Role varchar(255),
    Company varchar(255),
    DateApplied date,
    Location varchar(255),
    StatusID int not null,
    foreign key (StatusID) references Status(StatusID),
    foreign key (UserID) references User(UserID)
);

create table DocumentCategory (
    DocCatID varchar(36) primary key,
    UserID varchar(36) not null,
    Name varchar(255) not null, -- UI will present a dropdown of three choices (resumes, cover letters, and other). user can only have 3 document types for now
    foreign key (UserID) references User(UserID)
);

create table Document (
    DocumentID varchar(36) primary key,
    DocCatID varchar(36) not null,
    UserID varchar(36) not null,
    Name varchar(255) not null,
    Link varchar(255) not null,
    foreign key (UserID) references User(UserID),
    foreign key (DocCatID) references DocumentCategory(DocCatID)
);