-- auto-generated definition
create table reports
(
    id            serial
        constraint reports_pk
            primary key,
    datacenter_id integer                  not null,
    world_id      integer                  not null,
    territory_id  integer                  not null,
    date          timestamp with time zone not null
);

alter table reports
    owner to postgres;

create unique index reports_id_uindex
    on reports (id);

