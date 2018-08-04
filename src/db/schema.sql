--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS chainstack;
--
-- Name: chainstack; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE chainstack WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE chainstack OWNER TO postgres;

\connect chainstack

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: cs
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    name character varying,
    owner integer
);


ALTER TABLE public.resources OWNER TO cs;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: cs
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resources_id_seq OWNER TO cs;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: cs
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying,
    password_hash character varying,
    role character varying,
    quota integer
);


ALTER TABLE public.users OWNER TO cs;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: cs
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO cs;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: cs
--

COPY public.resources (id, name, owner) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cs
--

COPY public.users (id, email, password_hash, role, quota) FROM stdin;
\.


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cs
--

SELECT pg_catalog.setval('public.resources_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cs
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: users users_id_pk; Type: CONSTRAINT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_pk PRIMARY KEY (id);


--
-- Name: resources resources_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_users_id_fk FOREIGN KEY (owner) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

