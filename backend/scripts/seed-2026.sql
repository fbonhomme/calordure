-- Script SQL pour importer les données de collecte 2026
-- Pont-sur-Yonne (Bourg)
-- À exécuter sur la base de données Azure MySQL

-- Supprimer les données 2026 existantes
DELETE FROM collecte_calendrier WHERE annee = 2026;
DELETE FROM jours_feries WHERE annee = 2026;

-- JANVIER 2026
-- Bac jaune (mercredi)
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-01-07 12:00:00', 'jaune', 2026, 1, 7, 0),
('2026-01-14 12:00:00', 'jaune', 2026, 1, 14, 0),
('2026-01-21 12:00:00', 'jaune', 2026, 1, 21, 0),
('2026-01-28 12:00:00', 'jaune', 2026, 1, 28, 0);

-- Bac gris (samedi)
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-01-03 12:00:00', 'gris', 2026, 1, 3, 0),
('2026-01-10 12:00:00', 'gris', 2026, 1, 10, 0),
('2026-01-17 12:00:00', 'gris', 2026, 1, 17, 0),
('2026-01-24 12:00:00', 'gris', 2026, 1, 24, 0),
('2026-01-31 12:00:00', 'gris', 2026, 1, 31, 0);

-- FEVRIER 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-02-04 12:00:00', 'jaune', 2026, 2, 4, 0),
('2026-02-11 12:00:00', 'jaune', 2026, 2, 11, 0),
('2026-02-18 12:00:00', 'jaune', 2026, 2, 18, 0),
('2026-02-25 12:00:00', 'jaune', 2026, 2, 25, 0),
('2026-02-07 12:00:00', 'gris', 2026, 2, 7, 0),
('2026-02-14 12:00:00', 'gris', 2026, 2, 14, 0),
('2026-02-21 12:00:00', 'gris', 2026, 2, 21, 0),
('2026-02-28 12:00:00', 'gris', 2026, 2, 28, 0);

-- MARS 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-03-04 12:00:00', 'jaune', 2026, 3, 4, 0),
('2026-03-11 12:00:00', 'jaune', 2026, 3, 11, 0),
('2026-03-18 12:00:00', 'jaune', 2026, 3, 18, 0),
('2026-03-25 12:00:00', 'jaune', 2026, 3, 25, 0),
('2026-03-07 12:00:00', 'gris', 2026, 3, 7, 0),
('2026-03-14 12:00:00', 'gris', 2026, 3, 14, 0),
('2026-03-21 12:00:00', 'gris', 2026, 3, 21, 0),
('2026-03-28 12:00:00', 'gris', 2026, 3, 28, 0);

-- AVRIL 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-04-01 12:00:00', 'jaune', 2026, 4, 1, 0),
('2026-04-08 12:00:00', 'jaune', 2026, 4, 8, 0),
('2026-04-15 12:00:00', 'jaune', 2026, 4, 15, 0),
('2026-04-22 12:00:00', 'jaune', 2026, 4, 22, 0),
('2026-04-29 12:00:00', 'jaune', 2026, 4, 29, 0),
('2026-04-04 12:00:00', 'gris', 2026, 4, 4, 0),
('2026-04-11 12:00:00', 'gris', 2026, 4, 11, 0),
('2026-04-18 12:00:00', 'gris', 2026, 4, 18, 0),
('2026-04-25 12:00:00', 'gris', 2026, 4, 25, 0);

-- MAI 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-05-06 12:00:00', 'jaune', 2026, 5, 6, 0),
('2026-05-13 12:00:00', 'jaune', 2026, 5, 13, 0),
('2026-05-20 12:00:00', 'jaune', 2026, 5, 20, 0),
('2026-05-27 12:00:00', 'jaune', 2026, 5, 27, 0),
('2026-05-02 12:00:00', 'gris', 2026, 5, 2, 0),
('2026-05-09 12:00:00', 'gris', 2026, 5, 9, 0),
('2026-05-16 12:00:00', 'gris', 2026, 5, 16, 0),
('2026-05-23 12:00:00', 'gris', 2026, 5, 23, 0),
('2026-05-30 12:00:00', 'gris', 2026, 5, 30, 0);

-- JUIN 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-06-03 12:00:00', 'jaune', 2026, 6, 3, 0),
('2026-06-10 12:00:00', 'jaune', 2026, 6, 10, 0),
('2026-06-17 12:00:00', 'jaune', 2026, 6, 17, 0),
('2026-06-24 12:00:00', 'jaune', 2026, 6, 24, 0),
('2026-06-06 12:00:00', 'gris', 2026, 6, 6, 0),
('2026-06-13 12:00:00', 'gris', 2026, 6, 13, 0),
('2026-06-20 12:00:00', 'gris', 2026, 6, 20, 0),
('2026-06-27 12:00:00', 'gris', 2026, 6, 27, 0);

-- JUILLET 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-07-01 12:00:00', 'jaune', 2026, 7, 1, 0),
('2026-07-08 12:00:00', 'jaune', 2026, 7, 8, 0),
('2026-07-15 12:00:00', 'jaune', 2026, 7, 15, 0),
('2026-07-22 12:00:00', 'jaune', 2026, 7, 22, 0),
('2026-07-29 12:00:00', 'jaune', 2026, 7, 29, 0),
('2026-07-04 12:00:00', 'gris', 2026, 7, 4, 0),
('2026-07-11 12:00:00', 'gris', 2026, 7, 11, 0),
('2026-07-18 12:00:00', 'gris', 2026, 7, 18, 0),
('2026-07-25 12:00:00', 'gris', 2026, 7, 25, 0);

-- AOUT 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-08-05 12:00:00', 'jaune', 2026, 8, 5, 0),
('2026-08-12 12:00:00', 'jaune', 2026, 8, 12, 0),
('2026-08-19 12:00:00', 'jaune', 2026, 8, 19, 0),
('2026-08-26 12:00:00', 'jaune', 2026, 8, 26, 0),
('2026-08-01 12:00:00', 'gris', 2026, 8, 1, 0),
('2026-08-08 12:00:00', 'gris', 2026, 8, 8, 0),
('2026-08-15 12:00:00', 'gris', 2026, 8, 15, 0),
('2026-08-22 12:00:00', 'gris', 2026, 8, 22, 0),
('2026-08-29 12:00:00', 'gris', 2026, 8, 29, 0);

-- SEPTEMBRE 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-09-02 12:00:00', 'jaune', 2026, 9, 2, 0),
('2026-09-09 12:00:00', 'jaune', 2026, 9, 9, 0),
('2026-09-16 12:00:00', 'jaune', 2026, 9, 16, 0),
('2026-09-23 12:00:00', 'jaune', 2026, 9, 23, 0),
('2026-09-30 12:00:00', 'jaune', 2026, 9, 30, 0),
('2026-09-05 12:00:00', 'gris', 2026, 9, 5, 0),
('2026-09-12 12:00:00', 'gris', 2026, 9, 12, 0),
('2026-09-19 12:00:00', 'gris', 2026, 9, 19, 0),
('2026-09-26 12:00:00', 'gris', 2026, 9, 26, 0);

-- OCTOBRE 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-10-07 12:00:00', 'jaune', 2026, 10, 7, 0),
('2026-10-14 12:00:00', 'jaune', 2026, 10, 14, 0),
('2026-10-21 12:00:00', 'jaune', 2026, 10, 21, 0),
('2026-10-28 12:00:00', 'jaune', 2026, 10, 28, 0),
('2026-10-03 12:00:00', 'gris', 2026, 10, 3, 0),
('2026-10-10 12:00:00', 'gris', 2026, 10, 10, 0),
('2026-10-17 12:00:00', 'gris', 2026, 10, 17, 0),
('2026-10-24 12:00:00', 'gris', 2026, 10, 24, 0),
('2026-10-31 12:00:00', 'gris', 2026, 10, 31, 0);

-- NOVEMBRE 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-11-04 12:00:00', 'jaune', 2026, 11, 4, 0),
('2026-11-11 12:00:00', 'jaune', 2026, 11, 11, 0),
('2026-11-18 12:00:00', 'jaune', 2026, 11, 18, 0),
('2026-11-25 12:00:00', 'jaune', 2026, 11, 25, 0),
('2026-11-07 12:00:00', 'gris', 2026, 11, 7, 0),
('2026-11-14 12:00:00', 'gris', 2026, 11, 14, 0),
('2026-11-21 12:00:00', 'gris', 2026, 11, 21, 0),
('2026-11-28 12:00:00', 'gris', 2026, 11, 28, 0);

-- DECEMBRE 2026
INSERT INTO collecte_calendrier (date, typeCollecte, annee, mois, jour, estFerie) VALUES
('2026-12-02 12:00:00', 'jaune', 2026, 12, 2, 0),
('2026-12-09 12:00:00', 'jaune', 2026, 12, 9, 0),
('2026-12-16 12:00:00', 'jaune', 2026, 12, 16, 0),
('2026-12-23 12:00:00', 'jaune', 2026, 12, 23, 0),
('2026-12-30 12:00:00', 'jaune', 2026, 12, 30, 0),
('2026-12-05 12:00:00', 'gris', 2026, 12, 5, 0),
('2026-12-12 12:00:00', 'gris', 2026, 12, 12, 0),
('2026-12-19 12:00:00', 'gris', 2026, 12, 19, 0),
('2026-12-26 12:00:00', 'gris', 2026, 12, 26, 0);

-- JOURS FERIES 2026
INSERT INTO jours_feries (date, nom, annee) VALUES
('2026-01-01 12:00:00', 'Jour de l''An', 2026),
('2026-04-06 12:00:00', 'Lundi de Pâques', 2026),
('2026-05-01 12:00:00', 'Fête du Travail', 2026),
('2026-05-08 12:00:00', 'Victoire 1945', 2026),
('2026-05-14 12:00:00', 'Ascension', 2026),
('2026-05-25 12:00:00', 'Lundi de Pentecôte', 2026),
('2026-07-14 12:00:00', 'Fête Nationale', 2026),
('2026-08-15 12:00:00', 'Assomption', 2026),
('2026-11-01 12:00:00', 'Toussaint', 2026),
('2026-11-11 12:00:00', 'Armistice 1918', 2026),
('2026-12-25 12:00:00', 'Noël', 2026);

-- Marquer les collectes qui tombent un jour férié
UPDATE collecte_calendrier
SET estFerie = 1
WHERE DATE(date) IN (
  '2026-01-01', '2026-04-06', '2026-05-01', '2026-05-08',
  '2026-05-14', '2026-05-25', '2026-07-14', '2026-08-15',
  '2026-11-01', '2026-11-11', '2026-12-25'
);

-- Afficher un résumé
SELECT 'Collectes 2026 importées' as message, COUNT(*) as count FROM collecte_calendrier WHERE annee = 2026
UNION ALL
SELECT 'Jours fériés 2026 importés', COUNT(*) FROM jours_feries WHERE annee = 2026;
