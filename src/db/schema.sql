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
-- Name: sessions; Type: TABLE; Schema: public; Owner: cs
--

CREATE TABLE public.sessions (
    user_id integer,
    session_id character varying NOT NULL,
    expires_at timestamp without time zone
);


ALTER TABLE public.sessions OWNER TO cs;

--
-- Name: users; Type: TABLE; Schema: public; Owner: cs
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying,
    password_hash character varying,
    role character varying DEFAULT 'normal'::character varying,
    quota integer DEFAULT '-1'::integer
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
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- Name: users users_id_pk; Type: CONSTRAINT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_pk PRIMARY KEY (id);


--
-- Name: sessions_session_id_uindex; Type: INDEX; Schema: public; Owner: cs
--

CREATE UNIQUE INDEX sessions_session_id_uindex ON public.sessions USING btree (session_id);


--
-- Name: users_email_uindex; Type: INDEX; Schema: public; Owner: cs
--

CREATE UNIQUE INDEX users_email_uindex ON public.users USING btree (email);


--
-- Name: resources resources_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cs
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_users_id_fk FOREIGN KEY (owner) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

