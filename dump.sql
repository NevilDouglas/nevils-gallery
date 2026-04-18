--
-- PostgreSQL database dump
--

-- Dumped from database version 16rc1
-- Dumped by pg_dump version 16rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: schema_nevils_gallery; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema_nevils_gallery;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: paintings; Type: TABLE; Schema: schema_nevils_gallery; Owner: -
--

CREATE TABLE schema_nevils_gallery.paintings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    image character varying(255),
    title character varying(255),
    artist character varying(255),
    ranking character varying(10),
    description text,
    ownerid uuid,
    "altText" character varying(255)
);


--
-- Name: paintings_original; Type: TABLE; Schema: schema_nevils_gallery; Owner: -
--

CREATE TABLE schema_nevils_gallery.paintings_original (
    id character varying(10) NOT NULL,
    image character varying(100),
    title character varying(100),
    artist character varying(100),
    ranking character varying(10),
    description text,
    ownerid character varying(10)
);


--
-- Name: users; Type: TABLE; Schema: schema_nevils_gallery; Owner: -
--

CREATE TABLE schema_nevils_gallery.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fname character varying(50),
    lname character varying(50),
    cname character varying(50),
    admin character varying(50),
    username character varying(100),
    password character varying(255)
);


--
-- Name: users_original; Type: TABLE; Schema: schema_nevils_gallery; Owner: -
--

CREATE TABLE schema_nevils_gallery.users_original (
    id character varying(10) NOT NULL,
    fname character varying(50),
    lname character varying(50),
    cname character varying(50),
    admin character varying(5),
    email character varying(100),
    password character varying(100)
);


--
-- Data for Name: paintings; Type: TABLE DATA; Schema: schema_nevils_gallery; Owner: -
--

COPY schema_nevils_gallery.paintings (id, image, title, artist, ranking, description, ownerid, "altText") FROM stdin;
0715995f-1c12-43ef-b385-14eb643891a9	/assets/img/initials/The_Persistence_of_Memory.jpg	The Persistence of Memory	Salvador Dali	5	Painted in 1931 by yet another Spanish artist, Salvador Dali''s The Persistence of Memory is one of the most recognizable and individual pieces in art history. Depicting a dismal shoreline draped with melting clocks, it is thought that Albert Einstein''s Theory of Relativity inspired this bizarre piece.	\N	\N
14bc1015-1ab0-4054-85d6-ca0fe7318a9c	/assets/img/initials/Cafe_Terrace_at_Night.jpg	Cafe Terrace at Night	Vincent van Gogh	16	Never one for flashy titles, Cafe Terrace at Night (1888) by the ever-prolific Vincent Van Gogh, is one of the most individual depictions of such a mundane setting. Though Van Gogh never signed this piece, he references his famous Cafe masterpiece in many personal documents.	\N	\N
14ed98a1-311f-4a6f-93b1-2d2761695391	/assets/img/initials/Guernica.jpg	Guernica	Pablo Picasso	4	Inspired by the bombing of Guernica, Spain, during the Spanish Civil War, Pablo Picasso completed this most famous piece, Guernica, in 1937. This piece was originally commissioned by the Spanish government and intended to depict the suffering of war and ultimately stand as symbol for peace.	\N	\N
19a84cec-886a-4b8e-a8ad-e194e9f2170f	/assets/img/initials/Bal_du_moulin_de_la_Galette.jpg	Bal du moulin de la Galette	Pierre-Auguste Renoires	19	While the imagery in this painting might not be the most immediately recognizable, having sold for $78.1 million (adjusted price of $127.4 million), French artist Pierre-Auguste Renoires Bal du Moulin de la Galette is one of the most expensive paintings of all time and therefore, one of the most famous.	\N	\N
19ce6a30-cea8-4500-b716-3b93c9e9e614	/assets/img/initials/No._5,_1948.jpg	No. 5, 1948	Jackson Pollock	18	Jackson Pollock was an influential American painter and a major figure in the abstract expressionist movement. No. 5, 1948 is one of his most famous drip paintings, created by pouring and dripping household paint onto a horizontal canvas. It''s considered a masterpiece of abstract expressionism.	\N	\N
1e40e548-3a7e-44fa-b151-dc790129b5a5	/assets/img/initials/Girl_with_a_Pearl_Earring.jpg	Girl with a Pearl Earring	Johannes Vermeer	8	Considered by some to be the Mona Lisa of the North, this enchanting painting by the Dutch artist, Johannes Vermeer, features exactly what the title infers - a Girl with a Pearl Earring. Completed circa 1665, this piece can now be found in the Mauritshuis Gallery in The Hague.	\N	\N
357f3f59-c661-45b9-b4a1-25114877d2cf	/assets/img/initials/Dogs_Playing_Poker.jpg	Dogs Playing Poker	C.M. Coolidge	20	Commissioned by Brown & Begelow Cigars in 1903, American painter C.M. Coolidge painted 16 unforgettable images of Dogs Playing Poker for the brand. Spoofed many times in greeting cards and in popular culture, this series of dogs playing cards around a table is widely recognizable and truly iconic.	\N	\N
36bdf097-ffd7-4a03-a5b7-a311addcfb29	/assets/img/initials/Whistler''s_Mother.jpg	Whistler''s Mother	James McNeill Whistler	9	Whistler''s Mother is the truncated name for James McNeill Whistler''s very famous portrait originally known as Arrangement in Grey and Black: The Artist''s Mother. Painted in 1871, it''s one of the few American pieces on this list - although it is owned by a Parisian museum and therefore rarely seen in the states.	\N	\N
469f9406-e2f4-48f6-93b0-ff38f49f281e	/assets/img/initials/A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte.jpg	A Sunday Afternoon on the Island of La Grande Jatte	Georges Seurat	7	Using the unique technique of pointillism, creating a complete image that is made up of only distinct individual dots, the French painter Georges Seurat brings us his most famous piece A Sunday Afternoon on the Island of La Grande Jatte.	\N	\N
4be977a0-bf12-47d9-965a-98610f4d315a	/assets/img/initials/American_Gothic.jpg	American Gothic	Grant Wood	15	Marking the list as another iconic piece in American art, American Gothic, painted by Grant Wood in 1930 is a dry depiction of a farmer and his Plain-Jane daughter - The Great Depression personified.	\N	\N
671fa6fd-da4a-4d28-b4f4-065e7500ece7	/assets/img/initials/The_Mona_Lisa.jpg	The Mona Lisa	Leonardo da Vinci	1	Any list of Most Famous paintings would be incomplete without the mention of the Mona Lisa by Leonardo da Vinci. This infamous portrait of Lisa del Giocondo was completed some time between 1503-1519 and currently on display at the Musee du Louvre in Paris.	\N	\N
855a5f67-34f4-4cab-a066-b89722872459	/assets/img/initials/Portrait_de_L''artiste_Sans_Barbe.jpg	Portrait de L''artiste Sans Barbe	Vincent van Gogh	10	Although the title isn''t very creative, Vincent van Gogh''s Self-Portrait without Beard is certainly one of the most notable paintings of all time. While Van Gogh has painted many portraits before, this is the most notable because it''s one of the few that depicts him without a beard. Additionally, having sold for $71.5 million in 1998, it is one of the most expensive paintings ever sold.	\N	\N
9b48103a-6402-42d0-a0d1-370105aac378	/assets/img/initials/Three_Musicians.jpg	Three Musicians	Pablo Picasso	6	At first glance, it might look like a collage, but Pablo Picasso''s famous painting, Three Musicians, is actually an oil painting. Completed in 1921, he painted two very similar paintings that are mutually referred to as Three Musicians and can be found in the New York MoMA and the Philadelphia Museum of Art.	\N	\N
9f84b33d-df8a-4afe-896c-dba4ec2a11b5	/assets/img/initials/The_Son_of_Man.jpg	The Son of Man	Rene Magritte	17	The most current piece of all on this list, painted in 1964, is Rene Magrittees The Son of Man. Although it is a self-portrait, his face is largely covered by a floating green apple and contributes to his series of paintings known as the The Great War on Facades.	\N	\N
d7be9d31-aca9-4c6c-8c6a-457df1889d00	/assets/img/initials/Water_Lilies.jpg	Water Lilies	Claude Monet	13	French painter Claude Monet painted a series of 250 pieces known as Water Lilies between 1840 and 1926 - it''s exactly what it sounds like, 250 paintings depicting a water lily pond from his backyard. While this might not be one individual painting, considering the collection is spread amongst the most renowned galleries of the world, the series deserves a spot on this list.	\N	\N
d8694e59-309f-4d56-a0d6-da82d921b0eb	/assets/img/initials/Starry_Night.jpg	Starry Night	Vincent van Gogh	2	Vincent van Gogh has painted countless well-known pieces; however, his painting Starry Night is widely considered to be his magnum opus. Painted in 1889, the piece was done from memory and whimsically depicts the view from his room at the sanitarium he resided in at the time.	\N	\N
dd06724d-97f2-47cd-a1b7-b523c98f7acc	/assets/img/initials/The_Kiss.jpg	The Kiss	Gustav Klimt	12	Easily touted as Gustav Klimt''s most famous painting, The Kiss is a realistic yet geometric depiction of a kissing couple, completed in 1908 in Vienna, Austria. What makes this piece different than the other oil paintings on the list is that it also incorporates gold leaf on canvas (in addition to oils).	\N	\N
e0cab2f7-4ac4-4d8f-8203-5a8591d10711	/assets/img/initials/The_Flower_Carrier.jpg	The Flower Carrier	Diego Rivera	14	Known in its native tongue as Cargador de Flores, The Flower Carrier was painted by Diego Rivera in 1935. Widely considered to be the greatest Mexican painter of the twentieth century, Rivera was known for his simple paintings dominated by their bright colors and The Flower Carrier is no exception.	\N	\N
eb1adf7a-4813-456f-8583-7771e4184f7a	/assets/img/initials/The_Scream.jpg	The Scream	Edvard Munch	3	Using oil and pastel on cardboard, Edvard Munch painted his most famous piece, The Scream, circa 1893. Featuring a ghoulish figure that looks like the host from Tales from the Crypt, the backdrop of this expressionist painting is said to be Oslo, Norway.	\N	\N
ecb7ea8c-03de-4847-a28d-a2f4ea0790b4	/assets/img/initials/The_Night_Watch.jpg	The Night Watch	Rembrandt van Rijn	11	In its native Dutch tongue, De Nachtwacht is most popularly referred to in modern culture as The Night Watch. Using oil on canvas, Rembrandt (van Rijn) was commissioned by a militia captain and his 17 militia guards in 1642 to paint their company, in an effort to show off for the French Queen that would be visiting.	\N	\N
\.


--
-- Data for Name: paintings_original; Type: TABLE DATA; Schema: schema_nevils_gallery; Owner: -
--

COPY schema_nevils_gallery.paintings_original (id, image, title, artist, ranking, description, ownerid) FROM stdin;
101	../assets/img/The_Mona_Lisa.jpg	Mona Lisa	Leonardo da Vinci	001	Any list of Most Famous paintings would be incomplete without the mention of the Mona Lisa by Leonardo da Vinci. This infamous portrait of Lisa del Giocondo was completed some time between 1503-1519 and currently on display at the Musee du Louvre in Paris.	1000
102	../assets/img/Starry_Night.jpg	Starry Night	Vincent van Gogh	002	Vincent van Gogh has painted countless well-known pieces; however, his painting Starry Night is widely considered to be his magnum opus. Painted in 1889, the piece was done from memory and whimsically depicts the view from his room at the sanitarium he resided in at the time.	1001
103	../assets/img/The_Scream.jpg	The Scream	Edvard Munch	003	Using oil and pastel on cardboard, Edvard Munch painted his most famous piece, The Scream, circa 1893. Featuring a ghoulish figure that looks like the host from Tales from the Crypt, the backdrop of this expressionist painting is said to be Oslo, Norway.	1001
104	../assets/img/Guernica.jpg	Guernica	Pablo Picasso	004	Inspired by the bombing of Guernica, Spain, during the Spanish Civil War, Pablo Picasso completed this most famous piece, Guernica, in 1937. This piece was originally commissioned by the Spanish government and intended to depict the suffering of war and ultimately stand as symbol for peace.	1003
105	../assets/img/The_Persistence_of_Memory.jpg	The Persistence of Memory	Salvador Dali	005	Painted in 1931 by yet another Spanish artist, Salvador Dali''s The Persistance of Memory is one of the most recognizable and individual pieces in art history. Depicting a dismal shoreline draped with melting clocks, it is thought that Albert Einstein''s Theory of Relativity inspired this bizarre piece.	1003
106	../assets/img/Three_Musicians.jpg	Three Musicians	Pablo Picasso	006	At first glance it might look like a collage but Pablo Picasso''s famous painting, Three Musicians is actually an oil painting. Completed in 1921, he painted two very similar paintings that are mutually referred to as Three Musicians and can be found in the New York MoMA and the Philadelphia Museum of Art.	1003
107	../assets/img/A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte.jpg	A Sunday Afternoon on the Island of La Grande Jatte	Georges Seurat	007	Using the unique technique of pointillism, creating a complete image that is made up of only distinct individual dots, the French painter Georges Seurat brings us his most famous piece A Sunday Afternoon on the Island of La Grande Jatte.	9999
108	../assets/img/Girl_with_a_Pearl_Earring.jpg	Girl with a Pearl Earring	Johannes Vermeer	008	Considered by some to be the Mona Lisa of the North, this enchanting painting by the Dutch artist, Johannes Vermeer, features exactly what the title infers - a Girl with a Peal Earring. Completed circa 1665, this piece can now be found in the Mauritshuis Gallery in the Hague.	9999
109	../assets/img/Whistler''s_Mother.jpg	Whistler''s Mother	James McNeill Whistler	009	Whistler''s Mother is the truncated name for James McNeill Whistler''s very famous portrait originally known as Arrangement in Grey and Black: The Artist''s Mother. Painted in 1871, it''s one of the few American pieces on this list - although it is owned by a Parisian museum and therefore rarely seen in the states.	9999
110	../assets/img/Portrait_de_L''artiste_Sans_Barbe.jpg	Portrait de L''artiste Sans Barbe	Vincent van Gogh	010	Although the title isn''t very creative, Vincent van Gogh''s Self-Portrait without Beard is certainly one of the most notable paintings of all time. While Van Gogh has painted many portraits before, this is the most notable because it''s one of the few that depicts him without a beard. Additionally, having sold for $71.5 million in 1998, it is one of the most expensive paintings ever sold.	9999
111	../assets/img/The_Night_Watch.jpg	The Night Watch	Rembrandt van Rijn	011	In its native Dutch tongue, De Nachtwacht is most popularly referred to in modern culture as The Night Watch. Using oil on canvas, Rembrandt (van Rijn) was commissioned by a militia captain and his 17 militia guards in 1642 to paint their company, in an effort to show off for the French Queen that would be visiting.	9999
112	../assets/img/The_Kiss.jpg	The Kiss	Gustav Klimt	012	Easily touted as Gustav Klimt''s most famous painting, The Kiss is a realistic yet geometric depiction of a kissing couple, completed in 1908 in Vienna, Austria. What makes this piece different than the other oil paintings on the list is that it also incorporates gold leaf on canvas (in addition to oils).	9999
113	../assets/img/Water_Lilies.jpg	Water Lilies	Claude Monet	013	French painter Claude Monet painted a series of 250 pieces known as Water Lilies between 1840 and 1926 - it''s exactly what it sounds like, 250 paintings depicting a water lily pond from his backyard. While this might not be one individual painting, considering the collection is spread amongst the most renowned galleries of the world, the series is a deserving installment on this list.	9999
114	../assets/img/The_Flower_Carrier.jpg	The Flower Carrier	Diego Rivera	014	Known in its native tongue as =Cargador de Flores=, The Flower Carrier was painted by Diego Rivera in 1935. Widely considered to be the greatest Mexican painter of the twentieth century, Rivera was known for his simple paintings dominated by their bright colors and The Flower Carrier is no exception.	9999
115	../assets/img/American_Gothic.jpg	American Gothic	Grant Wood	015	Marking the list as another iconic piece in American art, American Gothic, painted by Grant Wood in 1930 is a dry depiction of a farmer and his Plain-Jane daughter - The Great Depression personified.	9999
116	../assets/img/Cafe_Terrace_at_Night.jpg	Cafe Terrace at Night	Vincent Van Gogh	016	Never one for flashy titles, Cafe Terrace at Night (1888) by the ever-prolific Vincent Van Gogh, is one of the most individual depictions of such a mundane setting. Though Van Gogh never signed this piece, he references his famous Cafe masterpiece in many personal documents.	9999
117	../assets/img/The_Son_of_Man.jpg	The Son of Man	Rene Magrittees	017	The most current piece of all on this list, painted in 1964, is Rene Magrittees The Son of Man. Although it is a self-portrait, his face is largely covered by a floating green apple and contributes to his series of paintings known as the The Great War on Facades.	9999
118	../assets/img/No._5,_1948.jpg	No. 5, 1948	Jackson Pollock	018	Another of the more current pieces, painted by Jackson Pollock in 1948, the impersonally titled No. 5, 1948, though chaotic, is a signature piece of art nonetheless and a revealing insight to the turmoil that was swirling within Pollock.	1002
119	../assets/img/Bal_du_moulin_de_ la_Galette.jpg	Bal du moulin de la Galette	Pierre-Auguste Renoires	019	While the imagery in this painting might not be the most immediately recognizable, having sold for $78.1 million (adjusted price of $127.4 million), French artist Pierre-Auguste Renoires Bal du Moulin de la Galette is one of the most expensive paintings of all time and therefore, one of the most famous.	1002
120	../assets/img/Dogs_Playing_Poker.jpg	Dogs Playing Poker	C.M. Coolidge	020	Commissioned by Brown & Begelow Cigars in 1903, American painter C.M. Coolidge painted 16 unforgettable images of Dogs Playing Poker for the brand. Spoofed many times in greeting cards and in popular culture, this series of dogs playing cards around a table is widely recognizable and truly iconic.	1002
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: schema_nevils_gallery; Owner: -
--

COPY schema_nevils_gallery.users (id, fname, lname, cname, admin, username, password) FROM stdin;
8cb014bf-0367-4c79-b427-3f1ff72daabf			Bank Of Arts	true	bank@example.com	$2a$06$tweIh7oDLW.iF3idUa6VbOhwT.uVd3WK39qQHAoshg/0PihpmAn4C
3f8deea8-3e2a-432d-82f5-7cf85f7c5a33	Albert	Einstein		false	user1@example.com	$2a$06$H7MSm0/ER6IXUe9hvp51w.IRWOh9eI/RO3Q4euLM2MhvLtmugrLK2
f9483b7f-2e6e-4ad5-953d-eb6b5093dc97	Paul	Dirac		false	user2@example.com	$2a$06$L0eso5m9YmGsLBVjQEgL8uuSlL7p2l0kiJepdj0BVWF2fNWHPNWr.
5f74c3f0-d550-439d-8d67-4aaa1ee92c2a	Administrator			true	admin@example.com	$2a$06$fPQ.UBdFqGiBPeyepC9WBes6e4tgAlFryIe1u3pgFzv/n5guBzz26
b2f52401-91e9-4c31-86c4-9fa412eb8492	Budi	Boniarto	PMC Inc.	true	budi@example.com	$2b$10$/EQatkSw.IDzynKGktMjeOhsTvOtG7HsxRGVlugVpbCdVkjMu5LKK
a4806dec-7ed5-46f0-bdf6-680864661224	Brietje	Sofietje		true	user3@example.com	$2a$06$4v7WCl1eP1xef4/r8gwUrOFsqT8mBQHg3kkZZSdLf8sDv2qrsq9Xa
02134126-a152-4950-8ed8-4dba12169819	Michael	Jackson	Michael Jackson	true	mike@example.com	$2b$10$dZeNEIO95YATeKpplmKzzO.SglU4MTsp0e3qrGtiaOu/BEgLvFNXG
\.


--
-- Data for Name: users_original; Type: TABLE DATA; Schema: schema_nevils_gallery; Owner: -
--

COPY schema_nevils_gallery.users_original (id, fname, lname, cname, admin, email, password) FROM stdin;
1000			Bank Of Art	true	bank@example.com	passwordbank
1001	Albert	Einstein		false	user1@example.com	password1
1002	Paul	Dirac		false	user2@example.com	password2
1003	Brietje	Sofietje		false	user3@example.com	password3
9999	Administrator			true	admin@example.com	passwordadmin
\.


--
-- Name: paintings_original paintings_original_pkey; Type: CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.paintings_original
    ADD CONSTRAINT paintings_original_pkey PRIMARY KEY (id);


--
-- Name: paintings paintings_pkey; Type: CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.paintings
    ADD CONSTRAINT paintings_pkey PRIMARY KEY (id);


--
-- Name: users_original users_original_pkey; Type: CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.users_original
    ADD CONSTRAINT users_original_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: paintings_original paintings_original_ownerid_fkey; Type: FK CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.paintings_original
    ADD CONSTRAINT paintings_original_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES schema_nevils_gallery.users_original(id) NOT VALID;


--
-- Name: paintings paintings_ownerid_fkey; Type: FK CONSTRAINT; Schema: schema_nevils_gallery; Owner: -
--

ALTER TABLE ONLY schema_nevils_gallery.paintings
    ADD CONSTRAINT paintings_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES schema_nevils_gallery.users(id);


--
-- PostgreSQL database dump complete
--

