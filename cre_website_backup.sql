--
-- PostgreSQL database dump
--

\restrict DgIOsLm3xoncA4ANTPZRAxIw6aos2uY0wIGUdtSkaxOVEcWg2NoGnUEg6DEonJz

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'en_attente',
    'confirme',
    'annule'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- Name: campaign_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaign_status AS ENUM (
    'brouillon',
    'ouverte',
    'fermee',
    'evaluee'
);


ALTER TYPE public.campaign_status OWNER TO postgres;

--
-- Name: project_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_status AS ENUM (
    'brouillon',
    'soumis',
    'en_validation',
    'accepte',
    'rejete',
    'archive'
);


ALTER TYPE public.project_status OWNER TO postgres;

--
-- Name: project_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_type AS ENUM (
    'machine_physique',
    'service_digital',
    'application',
    'recherche'
);


ALTER TYPE public.project_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'startup',
    'chercheur',
    'etudiant',
    'partenaire',
    'admin',
    'investor',
    'jury'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blogs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    author character varying(100) NOT NULL,
    image_url character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.blogs OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    resource_id uuid,
    user_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    status public.booking_status DEFAULT 'en_attente'::public.booking_status,
    purpose text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: campaign_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_applications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    campaign_id uuid,
    user_id uuid,
    project_title character varying(255) NOT NULL,
    pitch text NOT NULL,
    business_plan_url character varying(500),
    attachments jsonb DEFAULT '[]'::jsonb,
    score numeric(5,2),
    jury_notes text,
    scored_by uuid,
    submitted_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.campaign_applications OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    theme character varying(255),
    requirements text,
    deadline timestamp with time zone NOT NULL,
    status public.campaign_status DEFAULT 'brouillon'::public.campaign_status,
    banner_url character varying(500),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- Name: investor_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investor_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    investor_id uuid,
    startup_id uuid,
    project_id uuid,
    message text,
    status character varying(50) DEFAULT 'en_attente'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.investor_requests OWNER TO postgres;

--
-- Name: kpi_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kpi_reports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    project_id uuid,
    report_month date NOT NULL,
    revenue numeric(12,2) DEFAULT 0,
    expenses numeric(12,2) DEFAULT 0,
    hires integer DEFAULT 0,
    funds_raised numeric(12,2) DEFAULT 0,
    clients_acquired integer DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.kpi_reports OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sender_id uuid,
    receiver_id uuid,
    subject character varying(255),
    body text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    title character varying(255) NOT NULL,
    body text,
    link character varying(500),
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    project_type public.project_type NOT NULL,
    status public.project_status DEFAULT 'brouillon'::public.project_status,
    technical_specs jsonb DEFAULT '{}'::jsonb,
    tech_stack text[],
    research_domain character varying(255),
    research_methodology text,
    target_market text,
    budget_estimate numeric(12,2),
    team_size integer DEFAULT 1,
    attachments jsonb DEFAULT '[]'::jsonb,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    reviewer_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    mentor_name character varying(255)
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    description text,
    location character varying(255),
    capacity integer,
    is_available boolean DEFAULT true,
    image_url character varying(500),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role DEFAULT 'startup'::public.user_role NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    organization character varying(255),
    bio text,
    skills text[],
    avatar_url character varying(500),
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: workshop_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workshop_enrollments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    workshop_id uuid,
    user_id uuid,
    enrolled_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.workshop_enrollments OWNER TO postgres;

--
-- Name: workshops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workshops (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(100),
    instructor character varying(255),
    max_participants integer DEFAULT 30,
    location character varying(255),
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    is_online boolean DEFAULT false,
    image_url character varying(500),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.workshops OWNER TO postgres;

--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blogs (id, title, content, author, image_url, created_at, updated_at) FROM stdin;
722232b0-7d30-4258-9c15-4c6af60e8636	Presentation	<p>Le Centre National de Recherche en Environnement (C.R.E) est un établissement public à caractère scientifique et technologique. Créé par le Décret exécutif N°18/264 du 17/10/2018 et devenu opérationnel depuis l’installation du Professeur Zihad BOUSLAMA le 17/01/2019 en qualité de Directrice de ce dernier.<br/><br/>Mission:<br/>Conformément aux tâches spécifiées à l'article 7 du décret exécutif N ° 11-396 du 24 novembre 2011, le Centre est chargé de réaliser les programmes de recherche scientifique et de développement technologique dans le domaine de l'environnement visant la résolution des problématiques liées :<br/>- A la préservation, au développement et à la valorisation des ressources naturelles ;<br/>- A l’évaluation et à la modélisation des changements climatiques et leurs impacts sur l’environnement ;<br/>- A la prévention des risques liés aux pollutions et aux technologies de dépollutions ;<br/>- Au développement de l’économie verte ;<br/>- A la gestion et à la valorisation des déchets.<br/><br/>Equipe de recherche:<br/>Pour la réalisation de ses missions, le C.R.E est doté de 04 divisions de recherches à savoir :<br/>1. Environnement et Biodiversité.<br/>2. Environnement et Santé.<br/>3. Environnement, Modélisation et Changements Climatiques.<br/>4. Environnement et Eco-gestion des Déchets.<br/>Chaque division est constituée de laboratoires et d’équipes de recherche.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.213125+01	2026-09-28 23:38:32.213125+01
79034413-54a9-4fe7-a5d7-b0afbd3efb17	Organigramme	<p>Décret exécutif N°11/396 du 24/11/2011 fixe le statut type de l’établissement public à caractère scientifique et technologique. Décret exécutif N°18/264 de la 17/10/2018 portant création du centre de recherche en environnement (CRE) Annaba.<br/><br/>L'organigramme du centre comprend la Direction Générale, le Secrétariat Général, les Divisions de Recherche, le Conseil Scientifique, et le Comité d'Éthique. Cette structure garantit une gestion fluide des activités de recherche et administratives.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.2181+01	2026-09-28 23:38:32.2181+01
3c566d4b-2fd5-49f4-9ffc-bea37419f07e	Incubateur	<p>L'incubateur du CRE accompagne les porteurs de projets innovants et les startups dans le domaine de l'environnement. Nous offrons des espaces de coworking, un mentorat scientifique, et un accès facilité à nos équipements de pointe pour développer des prototypes et valider des solutions technologiques vertes.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.21927+01	2026-09-28 23:38:32.21927+01
ce0eeeeb-a202-44e0-8b8e-ed6b8455fadc	Cati	<p>Le Centre d’Appui à la Technologie et à l’Innovation (CATI) du CRE offre une assistance spécialisée en matière de propriété intellectuelle. Nous aidons les chercheurs et inventeurs à rechercher des informations sur les brevets, à rédiger des brevets et à valoriser leurs inventions environnementales.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.220365+01	2026-09-28 23:38:32.220365+01
f50bb4e9-ba33-4e7f-8295-fcb3b3315dbd	Chercheurs Permanents	<p>Le Centre de Recherche en Environnement regroupe une équipe d'élite de chercheurs permanents spécialisés dans divers domaines : biodiversité, santé environnementale, gestion des déchets et modélisation du changement climatique. Ces experts dirigent nos laboratoires et encadrent nos doctorants.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.221409+01	2026-09-28 23:38:32.221409+01
1776fe5c-4539-4b1e-a374-d82cc7cf26c0	Personnel De Soutien	<p>Le personnel de soutien à la recherche est essentiel au bon fonctionnement du CRE. Il est composé d'ingénieurs de laboratoire, de techniciens spécialisés, et d'administrateurs qui assurent le maintien des équipements de pointe et facilitent le travail quotidien des chercheurs.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.22252+01	2026-09-28 23:38:32.22252+01
1d72073d-5330-4d58-82c2-5da7b1e897bd	Chercheurs Associes	<p>Nos chercheurs associés proviennent d'universités et d'instituts partenaires, tant nationaux qu'internationaux. Ils collaborent sur des projets de recherche multidisciplinaires et enrichissent l'écosystème scientifique du CRE par leur expertise externe.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.22352+01	2026-09-28 23:38:32.22352+01
f8aa47cc-ad46-4953-8a2e-c6d4f6bbfebd	Corps Communs	<p>Les corps communs et autres personnels administratifs du CRE veillent à la gestion des ressources humaines, la comptabilité, l'informatique, et la logistique du centre. Ils sont la colonne vertébrale qui permet au centre d'opérer efficacement.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.22469+01	2026-09-28 23:38:32.22469+01
81b39ea6-dcd5-4ab4-aa4a-2630200d6870	Dispositifs Reglementaires	<p>Cette section regroupe l'ensemble des textes de loi, décrets, et réglementations régissant la recherche scientifique, l'environnement, et le fonctionnement des Établissements Publics à caractère Scientifique et Technologique (EPST) en Algérie.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.226097+01	2026-09-28 23:38:32.226097+01
7c907f2b-a187-46c6-ac53-08a9adcf2dfa	Reforme Budgetaire	<p>Dans le cadre de la modernisation de la gestion publique, le CRE a adopté les nouvelles directives de la réforme budgétaire, axées sur la performance, la transparence financière et l'optimisation des dépenses liées aux projets de recherche.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.227352+01	2026-09-28 23:38:32.227352+01
37c97e91-8c52-4f2c-9819-3a5727c63f2e	Stages Etranger	<p>Le CRE encourage la mobilité internationale de ses chercheurs à travers des bourses de stages de perfectionnement et des séjours scientifiques de haut niveau à l'étranger, en partenariat avec des institutions renommées mondiales.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.228989+01	2026-09-28 23:38:32.228989+01
cf78ea37-c80d-42e1-aded-5a3ec7c980ed	Appel A Projets	<p>Découvrez ici les appels à projets nationaux et internationaux en cours. Le CRE soutient ses chercheurs dans la soumission de projets compétitifs pour l'obtention de financements PNR (Programmes Nationaux de Recherche) et autres fonds d'innovation.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.230059+01	2026-09-28 23:38:32.230059+01
59cba058-0a8e-4c4f-bebc-84cf4f88c15a	Commissions	<p>Le centre s'appuie sur plusieurs commissions consultatives et décisionnelles : la Commission Paritaire pour les questions du personnel, le Comité d'Éthique pour valider les protocoles de recherche, le Conseil Scientifique pour l'évaluation des programmes, et le Conseil d'Administration.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.231021+01	2026-09-28 23:38:32.231021+01
2f26d844-871b-4091-bbbb-7dc5866b3dd1	Bilan Newsletter	<p>Retrouvez ici le bilan annuel de la production scientifique du CRE, ainsi que nos newsletters trimestrielles résumant les avancées de nos chercheurs, les événements marquants et les publications récentes.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.232571+01	2026-09-28 23:38:32.232571+01
c4a011f3-f950-4643-a8ef-ad291dd26c11	Projets Recherche	<p>Le CRE pilote plusieurs projets de recherche nationaux et internationaux (PNR, PRFU, projets de coopération). Nos thématiques portent sur la dépollution, la valorisation des déchets, la protection de la biodiversité et l'adaptation aux changements climatiques.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.233764+01	2026-09-28 23:38:32.233764+01
b892f95f-ba88-4ce4-8425-3d292c4a54ed	Publications Scientifiques	<p>Publications scientifiques, travaux de recherche et articles publiés par les chercheurs du Centre de Recherche en Environnement (CRE) dans des revues internationales de rang A et B.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.234865+01	2026-09-28 23:38:32.234865+01
09777fa1-7ccc-4977-8b51-173330fabb57	Equipements	<p>Le CRE dispose d'une plateforme technologique de pointe : chromatographie en phase gazeuse (GC-MS), microscopie électronique, spectromètres, séquenceurs ADN, et équipements de télédétection spatiale pour la surveillance de l'environnement.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.235947+01	2026-09-28 23:38:32.235947+01
729efbd4-7e9d-47d1-93ea-98bf2cdf12e0	Activites Anterieures	<p>Archive de nos précédentes activités de recherche, conférences organisées, et bilans des années antérieures. Le CRE capitalise sur ces expériences pour construire les programmes de recherche futurs.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.237418+01	2026-09-28 23:38:32.237418+01
987233c9-44ab-428b-8a02-2234add40f0a	Manifestations Scientifiques	<p>Le CRE organise régulièrement des séminaires internationaux, des colloques, et des journées d'étude (comme le Séminaire SNIRVEu et le séminaire One Health) rassemblant experts, industriels et décideurs autour des grands défis environnementaux.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.238446+01	2026-09-28 23:38:32.238446+01
c32c84b2-d4e5-4156-bfeb-994cbffff968	Expertise	<p>Nos équipes offrent des services d'expertise et de conseil environnemental pour les entreprises industrielles et les collectivités : études d'impact sur l'environnement, audits écologiques, et plans de gestion des déchets.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.239483+01	2026-09-28 23:38:32.239483+01
ce66f5b2-9d6c-4864-86a0-cef1415c4df7	Formation	<p>Le CRE propose des formations à la carte et des sessions de perfectionnement technique pour les professionnels de l'industrie, dans les domaines de l'analyse physico-chimique, de la norme ISO 14001, et de la sécurité environnementale.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.240487+01	2026-09-28 23:38:32.240487+01
efa838fa-4957-4b24-8f88-7bd0ec3ab433	Conventions	<p>Nous avons établi de multiples conventions cadre et contrats de recherche avec des acteurs socio-économiques et des partenaires industriels afin de transférer nos résultats de recherche vers des applications concrètes sur le marché.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.2417+01	2026-09-28 23:38:32.2417+01
8bc34b26-ce26-4f02-aee8-264730431896	Historique Evenements	<p>Revivez les moments forts de la vie du centre : inaugurations, visites officielles, cérémonies de remise de prix, et célébrations des journées mondiales de l'environnement.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.242784+01	2026-09-28 23:38:32.242784+01
28dcb17c-c66c-4908-9f24-1b683d807d45	Echos Presse	<p>Le CRE dans les médias. Retrouvez ici les articles de presse, les passages télévisés et les reportages consacrés aux découvertes de nos chercheurs et à nos événements publics.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.243918+01	2026-09-28 23:38:32.243918+01
47f2c138-bc23-4aa3-ab6f-4810c2d5435a	Consultation Marches	<p>Espace dédié aux opérateurs économiques. Consultez les avis d'appels d'offres nationaux et internationaux, les consultations, et les attributions provisoires de marchés publics du CRE.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.245271+01	2026-09-28 23:38:32.245271+01
1e60e8e2-32de-4543-bef7-59df5f1d0db9	Recrutement	<p>Rejoignez le Centre de Recherche en Environnement ! Consultez régulièrement cette page pour découvrir nos avis de recrutement de chercheurs, d'ingénieurs, et de personnel administratif.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.246382+01	2026-09-28 23:38:32.246382+01
e5ade573-5695-4039-8604-3379f63b0624	Liens Qr	<p>Scannez nos QR Codes pour accéder rapidement à nos applications mobiles, télécharger nos brochures numériques ou vous inscrire à nos prochains événements directement depuis votre smartphone.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.24738+01	2026-09-28 23:38:32.24738+01
40eb906c-f0de-441f-bd54-8fb9a4992a7b	One Health 2024	<p>Le séminaire international One Health 2024 a été un succès majeur, rassemblant des centaines d'experts autour de l'interconnexion entre la santé humaine, la santé animale et l'écosystème. Retrouvez les actes du séminaire et les recommandations phares.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.248248+01	2026-09-28 23:38:32.248248+01
4974a0eb-aac5-4a57-9ed5-c88f074b21c3	One Health 2026	<p>Préparez-vous pour la prochaine édition du Séminaire International One Health 2026. L'appel à communications sera bientôt lancé. Cet événement mettra l'accent sur les nouvelles pandémies et la résilience écologique.</p>	CRE Admin	https://cre.dz/images/headers/10.jpg	2026-09-28 23:38:32.249581+01	2026-09-28 23:38:32.249581+01
7e37a1e2-179b-43ad-85a4-ab3801c27bd8	Coordonnees	<p>Adresse : Siège : Alzone 23000, Annaba | Adresse Postale : BP 72A Menadia Annaba<br/>Téléphone / Fax : 038.59.04.44 / 038.45.10.44<br/>Email : contact@cre.dz<br/>Réseaux sociaux : Suivez-nous sur Facebook, LinkedIn et Twitter.</p>	CRE Admin	https://cre.dz/images/headers/blue-flower.jpg	2026-09-28 23:38:32.250513+01	2026-09-28 23:38:32.250513+01
f60aaf37-7401-499c-86f5-4ac7c860347e	Doleances	<p>Dans le cadre de l'amélioration de notre service public, ce registre de doléances numérique est mis à votre disposition pour exprimer vos requêtes, suggestions ou réclamations concernant l'administration du centre.</p>	CRE Admin	https://cre.dz/images/sampledata/parks/landscape/800px_cradlemountain.jpg	2026-09-28 23:38:32.251448+01	2026-09-28 23:38:32.251448+01
ac068fb9-d5ad-447a-a973-0387f89f4b1b	Webmail	<p>Accès&nbsp;direct&nbsp;à&nbsp;la&nbsp;plateforme&nbsp;de&nbsp;messagerie&nbsp;professionnelle&nbsp;sécurisée&nbsp;réservée&nbsp;exclusivement&nbsp;au&nbsp;personnel&nbsp;et&nbsp;aux&nbsp;chercheurs&nbsp;du&nbsp;Centre&nbsp;de&nbsp;Recherche&nbsp;en&nbsp;Environnement&nbsp;(Webmail&nbsp;Pro).</p>	CRE Admin	http://localhost:3001/uploads/blog-1790636392340-234943412.png	2026-09-28 23:38:32.252404+01	2026-09-28 23:59:58.082827+01
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, resource_id, user_id, start_time, end_time, status, purpose, created_at) FROM stdin;
8c8da384-1c35-41f5-a95c-3cd8973e3673	27dc279a-3fb6-466c-8e7d-867e44fa9465	40ee38eb-b70c-4c8c-9dae-36ebc19556cd	2026-09-06 19:09:00+01	2026-09-30 00:06:00+01	confirme	test	2026-09-27 19:06:52.630315+01
\.


--
-- Data for Name: campaign_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaign_applications (id, campaign_id, user_id, project_title, pitch, business_plan_url, attachments, score, jury_notes, scored_by, submitted_at) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, title, slug, description, theme, requirements, deadline, status, banner_url, created_at) FROM stdin;
7c3b2572-1d23-45e6-8616-33af81841188	dsfsdf	sdf.sf	sdfsdf	Green	sdfsdf	2026-09-27 19:36:00+01	ouverte	\N	2026-09-27 19:36:29.275572+01
\.


--
-- Data for Name: investor_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investor_requests (id, investor_id, startup_id, project_id, message, status, created_at) FROM stdin;
\.


--
-- Data for Name: kpi_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kpi_reports (id, user_id, project_id, report_month, revenue, expenses, hires, funds_raised, clients_acquired, notes, created_at) FROM stdin;
e0150337-1929-4743-a58d-7ad89963db7f	f34df561-fc6f-4000-b8d4-d3666d6511c2	ab2a2fc6-20e8-4efd-b953-a94eb9b31f32	2026-09-01	1000000000.00	25000.00	555	2222.00	5000		2026-09-27 19:33:22.527644+01
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, subject, body, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, body, link, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, user_id, title, description, project_type, status, technical_specs, tech_stack, research_domain, research_methodology, target_market, budget_estimate, team_size, attachments, submitted_at, reviewed_at, reviewer_notes, created_at, updated_at, mentor_name) FROM stdin;
ab2a2fc6-20e8-4efd-b953-a94eb9b31f32	124ef732-cb8a-4fff-958b-085ef2bfc1f5	SmartBin - Poubelle Intelligente	Système de tri des déchets automatisé utilisant l'IA et des capteurs IoT pour identifier et séparer les matériaux recyclables. La poubelle communique en temps réel avec une plateforme cloud.	machine_physique	accepte	{}	{Arduino,"TensorFlow Lite",Node.js}	\N	\N	Municipalités et collectivités locales	2500000.00	4	[]	2026-09-27 19:03:54.427155+01	\N	\N	2026-09-27 19:03:54.427155+01	2026-09-27 19:03:54.427155+01	\N
f6e5e8a0-301c-40c5-ba6c-2a3372ea1239	124ef732-cb8a-4fff-958b-085ef2bfc1f5	GreenTrack - Suivi Carbone	Application mobile permettant aux entreprises de suivre et réduire leur empreinte carbone avec des tableaux de bord interactifs et des recommandations personnalisées.	application	soumis	{}	{"React Native",Firebase,Python}	\N	\N	PME industrielles	1500000.00	3	[]	2026-09-27 19:03:54.430853+01	\N	\N	2026-09-27 19:03:54.430853+01	2026-09-27 19:03:54.430853+01	\N
4c88187f-298e-46d2-9dcb-9974085d47f5	068c55f4-5307-4710-ad79-8e77c5df021d	BioFiltre - Filtration Biologique	Développement d'un système de filtration biologique innovant pour le traitement des eaux usées industrielles utilisant des micro-organismes endémiques.	recherche	accepte	{}	\N	Sciences environnementales	Recherche expérimentale en laboratoire avec tests pilotes sur site industriel	\N	3000000.00	5	[]	2026-09-27 19:03:54.432517+01	\N	\N	2026-09-27 19:03:54.432517+01	2026-09-27 19:03:54.432517+01	\N
ba7ae91b-2cca-414b-875e-5042cacbdfb6	40ee38eb-b70c-4c8c-9dae-36ebc19556cd	v	hfh	machine_physique	rejete	{"weight": "kg", "materials": "PLA", "dimensions": "62"}	{}				\N	1	[]	2026-09-27 19:06:19.648041+01	2026-09-27 19:49:20.400191+01		2026-09-27 19:06:19.648041+01	2026-09-27 19:49:20.400191+01	\N
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resources (id, name, category, description, location, capacity, is_available, image_url, created_at) FROM stdin;
6e187f24-4036-41e3-8977-e8323e990f99	Imprimante 3D Ultimaker S5	imprimante_3d	Imprimante 3D haute précision pour prototypage	Salle 101 - Atelier	1	t	\N	2026-09-27 19:03:14.558874+01
610054b9-a2db-4a48-9872-b79a7e2553e8	Machine CNC 3 axes	cnc	Machine CNC pour usinage de pièces métalliques et plastiques	Salle 102 - Atelier	1	t	\N	2026-09-27 19:03:14.558874+01
86c67599-8916-4c05-9db8-91897773ba39	Salle de Réunion A	salle_reunion	Salle de réunion équipée (vidéoprojecteur, tableau blanc)	Étage 2 - Salle A	12	t	\N	2026-09-27 19:03:14.558874+01
32fcfce0-a3ba-44d5-8e13-699361ab0e8f	Salle de Réunion B	salle_reunion	Grande salle pour conférences et présentations	Étage 2 - Salle B	30	t	\N	2026-09-27 19:03:14.558874+01
27dc279a-3fb6-466c-8e7d-867e44fa9465	Espace Co-working	espace_travail	Espace de travail partagé avec postes informatiques	Étage 1	20	t	\N	2026-09-27 19:03:14.558874+01
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, first_name, last_name, phone, organization, bio, skills, avatar_url, is_active, is_verified, created_at, updated_at) FROM stdin;
f34df561-fc6f-4000-b8d4-d3666d6511c2	admin@cre-annaba.dz	$2b$12$wdhYHEWQyhHOxyRJ6kkOXO6q2Yuw/3WWqB4EjD9syGtVnhEBFjgdS	admin	Admin	CRE	\N	CRE Annaba	\N	\N	\N	t	f	2026-09-27 19:03:14.558874+01	2026-09-27 19:03:14.558874+01
124ef732-cb8a-4fff-958b-085ef2bfc1f5	karim@ecotech.dz	$2b$12$wdhYHEWQyhHOxyRJ6kkOXOW3Mu7BnWYjy.dIFjqaxTtF4yV4G1WeC	startup	Karim	Benali	\N	EcoTech DZ	Fondateur de EcoTech DZ, startup spécialisée dans les solutions de recyclage intelligent.	{IoT,Recyclage,"Machine Learning"}	\N	t	f	2026-09-27 19:03:54.420138+01	2026-09-27 19:03:54.420138+01
068c55f4-5307-4710-ad79-8e77c5df021d	amina@univ-annaba.dz	$2b$12$wdhYHEWQyhHOxyRJ6kkOXOW3Mu7BnWYjy.dIFjqaxTtF4yV4G1WeC	chercheur	Amina	Hadji	\N	Université Annaba	Chercheuse en sciences environnementales, spécialisée dans le traitement des eaux usées.	{"Chimie environnementale","Traitement des eaux",Microbiologie}	\N	t	f	2026-09-27 19:03:54.422094+01	2026-09-27 19:03:54.422094+01
4362b910-21ad-4922-98b4-59fa7bf7a27e	omar@greencapital.dz	$2b$12$wdhYHEWQyhHOxyRJ6kkOXOW3Mu7BnWYjy.dIFjqaxTtF4yV4G1WeC	investor	Omar	Mansouri	\N	Green Capital Fund	Business Angel spécialisé dans les startups GreenTech en Afrique du Nord.	\N	\N	t	f	2026-09-27 19:03:54.423382+01	2026-09-27 19:03:54.423382+01
40ee38eb-b70c-4c8c-9dae-36ebc19556cd	bedou@bedou.bedou	$2b$12$JdxfvWn0jntVuw1pTcCqRe./flkKhbaNQ9YiDKnh8KLSGtTdlyS42	startup	test	artec	0545897564	Artec-int		{gfhfh,fghfghfghg}	\N	t	f	2026-09-27 19:05:47.843414+01	2026-09-27 19:07:34.024674+01
\.


--
-- Data for Name: workshop_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workshop_enrollments (id, workshop_id, user_id, enrolled_at) FROM stdin;
2bcbe73e-b7f7-48cf-b3ab-1c18583a00e9	7a5376fa-ed45-4392-9aa6-9b77df007c42	40ee38eb-b70c-4c8c-9dae-36ebc19556cd	2026-09-27 19:07:03.697754+01
b5dae9cc-2c46-4ebb-a59b-36b066c87fb9	c90d75db-573a-4289-a6d1-56a98bcf7f2b	40ee38eb-b70c-4c8c-9dae-36ebc19556cd	2026-09-27 19:07:06.337527+01
ffe980cb-7a4b-4151-bc0c-e2c5c35f03ba	a7a9cc38-ada0-407c-9ca4-9e60613d9300	40ee38eb-b70c-4c8c-9dae-36ebc19556cd	2026-09-27 19:07:07.585206+01
\.


--
-- Data for Name: workshops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workshops (id, title, description, category, instructor, max_participants, location, start_date, end_date, is_online, image_url, created_at) FROM stdin;
c90d75db-573a-4289-a6d1-56a98bcf7f2b	Bootcamp MVP en 48h	Apprenez à concevoir et lancer votre produit minimum viable en seulement 48 heures.	bootcamp	Dr. Yacine Meziane	25	Salle B - CRE Annaba	2026-10-11 19:03:54.433938+01	2026-10-13 19:03:54.433938+01	f	\N	2026-09-27 19:03:54.433938+01
7a5376fa-ed45-4392-9aa6-9b77df007c42	SEO & Marketing Digital	Maîtrisez les fondamentaux du référencement et du marketing digital pour votre startup.	webinar	Sarah Benmoussa	50	\N	2026-10-04 19:03:54.433938+01	2026-10-04 19:03:54.433938+01	t	\N	2026-09-27 19:03:54.433938+01
a7a9cc38-ada0-407c-9ca4-9e60613d9300	Cloud Computing pour Startups	Introduction aux services cloud (AWS, GCP) et déploiement d'applications scalables.	bootcamp	Mehdi Cherif	20	Lab Informatique - CRE	2026-10-18 19:03:54.433938+01	2026-10-20 19:03:54.433938+01	f	\N	2026-09-27 19:03:54.433938+01
\.


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: campaign_applications campaign_applications_campaign_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_applications
    ADD CONSTRAINT campaign_applications_campaign_id_user_id_key UNIQUE (campaign_id, user_id);


--
-- Name: campaign_applications campaign_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_applications
    ADD CONSTRAINT campaign_applications_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_slug_key UNIQUE (slug);


--
-- Name: investor_requests investor_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_requests
    ADD CONSTRAINT investor_requests_pkey PRIMARY KEY (id);


--
-- Name: kpi_reports kpi_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kpi_reports
    ADD CONSTRAINT kpi_reports_pkey PRIMARY KEY (id);


--
-- Name: kpi_reports kpi_reports_project_id_report_month_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kpi_reports
    ADD CONSTRAINT kpi_reports_project_id_report_month_key UNIQUE (project_id, report_month);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: bookings no_overlap; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT no_overlap EXCLUDE USING gist (resource_id WITH =, tstzrange(start_time, end_time) WITH &&) WHERE ((status <> 'annule'::public.booking_status));


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workshop_enrollments workshop_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshop_enrollments
    ADD CONSTRAINT workshop_enrollments_pkey PRIMARY KEY (id);


--
-- Name: workshop_enrollments workshop_enrollments_workshop_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshop_enrollments
    ADD CONSTRAINT workshop_enrollments_workshop_id_user_id_key UNIQUE (workshop_id, user_id);


--
-- Name: workshops workshops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT workshops_pkey PRIMARY KEY (id);


--
-- Name: idx_bookings_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_resource ON public.bookings USING btree (resource_id);


--
-- Name: idx_bookings_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_time ON public.bookings USING btree (start_time, end_time);


--
-- Name: idx_kpi_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kpi_project ON public.kpi_reports USING btree (project_id);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);


--
-- Name: idx_projects_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_user ON public.projects USING btree (user_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: bookings bookings_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: campaign_applications campaign_applications_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_applications
    ADD CONSTRAINT campaign_applications_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_applications campaign_applications_scored_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_applications
    ADD CONSTRAINT campaign_applications_scored_by_fkey FOREIGN KEY (scored_by) REFERENCES public.users(id);


--
-- Name: campaign_applications campaign_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_applications
    ADD CONSTRAINT campaign_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: investor_requests investor_requests_investor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_requests
    ADD CONSTRAINT investor_requests_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: investor_requests investor_requests_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_requests
    ADD CONSTRAINT investor_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: investor_requests investor_requests_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_requests
    ADD CONSTRAINT investor_requests_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: kpi_reports kpi_reports_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kpi_reports
    ADD CONSTRAINT kpi_reports_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: kpi_reports kpi_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kpi_reports
    ADD CONSTRAINT kpi_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workshop_enrollments workshop_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshop_enrollments
    ADD CONSTRAINT workshop_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workshop_enrollments workshop_enrollments_workshop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workshop_enrollments
    ADD CONSTRAINT workshop_enrollments_workshop_id_fkey FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict DgIOsLm3xoncA4ANTPZRAxIw6aos2uY0wIGUdtSkaxOVEcWg2NoGnUEg6DEonJz

