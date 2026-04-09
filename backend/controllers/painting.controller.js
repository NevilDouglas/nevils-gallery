// backend/controllers/painting.controller.js

const { Painting, sequelize } = require('../models');
const { randomUUID } = require('crypto');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

const getAllPaintings = async (req, res) => {
    try {
        const paintings = await Painting.findAll({ order: [['ranking', 'ASC']] });
        res.json(paintings);
    } catch (error) {
        console.error("Fout bij ophalen alle schilderijen:", error);
        res.status(500).json({ error: error.message });
    }
};

const getPaintingById = async (req, res) => {
    try {
        const painting = await Painting.findByPk(req.params.id);
        if (!painting) {
            return res.status(404).json({ error: 'Painting not found' });
        }
        res.json(painting);
    } catch (error) {
        console.error(`Fout bij ophalen schilderij ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};

const createPainting = async (req, res) => {
    try {
        const { title, artist, ranking, description } = req.body;
        const image = req.file ? `/assets/img/${req.file.filename}` : null;

        const newRanking = parseInt(ranking, 10);
        if (!isNaN(newRanking)) {
            console.log(`Rankings >= ${newRanking} worden met 1 opgehoogd...`);
            await sequelize.query(
                `UPDATE schema_nevils_gallery.paintings
                 SET ranking = CAST(ranking AS INTEGER) + 1
                 WHERE ranking ~ '^[0-9]+$' AND CAST(ranking AS INTEGER) >= :newRanking`,
                { replacements: { newRanking } }
            );
            console.log(`Ranking-shift klaar. Nieuw schilderij krijgt ranking ${newRanking}.`);
        }

        const newPainting = await Painting.create({
            id: randomUUID(),
            title,
            artist,
            ranking,
            description,
            image,
        });
        res.status(201).json(newPainting);
    } catch (error) {
        console.error('Fout bij aanmaken schilderij:', error);
        res.status(500).json({ error: error.message });
    }
};

const updatePainting = async (req, res) => {
    try {
        const painting = await Painting.findByPk(req.params.id);
        if (!painting) return res.status(404).json({ error: 'Painting not found' });

        const oldRanking = parseInt(painting.ranking, 10);
        const newRanking = parseInt(req.body.ranking, 10);

        if (!isNaN(oldRanking) && !isNaN(newRanking) && oldRanking !== newRanking) {
            if (newRanking < oldRanking) {
                // Schilderij gaat omhoog: schuif alles in [newRanking, oldRanking-1] één plek omlaag
                console.log(`Rankings ${newRanking} t/m ${oldRanking - 1} worden met 1 opgehoogd...`);
                await sequelize.query(
                    `UPDATE schema_nevils_gallery.paintings
                     SET ranking = CAST(ranking AS INTEGER) + 1
                     WHERE ranking ~ '^[0-9]+$'
                       AND CAST(ranking AS INTEGER) >= :newRanking
                       AND CAST(ranking AS INTEGER) < :oldRanking
                       AND id != :id`,
                    { replacements: { newRanking, oldRanking, id: painting.id } }
                );
            } else {
                // Schilderij gaat omlaag: schuif alles in [oldRanking+1, newRanking] één plek omhoog
                console.log(`Rankings ${oldRanking + 1} t/m ${newRanking} worden met 1 verlaagd...`);
                await sequelize.query(
                    `UPDATE schema_nevils_gallery.paintings
                     SET ranking = CAST(ranking AS INTEGER) - 1
                     WHERE ranking ~ '^[0-9]+$'
                       AND CAST(ranking AS INTEGER) > :oldRanking
                       AND CAST(ranking AS INTEGER) <= :newRanking
                       AND id != :id`,
                    { replacements: { newRanking, oldRanking, id: painting.id } }
                );
            }
            console.log(`Ranking-shift klaar. Schilderij krijgt ranking ${newRanking}.`);
        }

        const updateData = {
            title: req.body.title,
            artist: req.body.artist,
            ranking: req.body.ranking,
            description: req.body.description,
        };

        if (req.file) {
            updateData.image = `/assets/img/${req.file.filename}`;
            if (painting.image && !painting.image.includes('/initials/')) {
                const oldImagePath = path.join(__dirname, '..', 'public', painting.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, err => {
                        if (err) console.error("Kon oude afbeelding niet verwijderen:", err);
                    });
                }
            }
        }

        await painting.update(updateData);
        res.json(await painting.reload());
    } catch (error) {
        console.error(`Fout bij bijwerken schilderij ${req.params.id}:`, error);
        res.status(500).json({ error: "Interne serverfout bij het bijwerken van het schilderij." });
    }
};

const deletePainting = async (req, res) => {
    try {
        const painting = await Painting.findByPk(req.params.id);
        if (!painting) return res.status(404).json({ error: 'Painting not found' });

        if (painting.image && !painting.image.includes('/initials/')) {
            const imagePath = path.join(__dirname, '..', 'public', painting.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await painting.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(`Fout bij verwijderen schilderij ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
};

const initialPaintings = [
    { id: '0715995f-1c12-43ef-b385-14eb643891a9', image: '/assets/img/initials/The_Persistence_of_Memory.jpg', title: 'The Persistence of Memory', artist: 'Salvador Dali', ranking: '5', description: 'Painted in 1931 by yet another Spanish artist, Salvador Dali\'s The Persistence of Memory is one of the most recognizable and individual pieces in art history. Depicting a dismal shoreline draped with melting clocks, it is thought that Albert Einstein\'s Theory of Relativity inspired this bizarre piece.' },
    { id: '14bc1015-1ab0-4054-85d6-ca0fe7318a9c', image: '/assets/img/initials/Cafe_Terrace_at_Night.jpg', title: 'Cafe Terrace at Night', artist: 'Vincent van Gogh', ranking: '16', description: 'Never one for flashy titles, Cafe Terrace at Night (1888) by the ever-prolific Vincent Van Gogh, is one of the most individual depictions of such a mundane setting. Though Van Gogh never signed this piece, he references his famous Cafe masterpiece in many personal documents.' },
    { id: '14ed98a1-311f-4a6f-93b1-2d2761695391', image: '/assets/img/initials/Guernica.jpg', title: 'Guernica', artist: 'Pablo Picasso', ranking: '4', description: 'Inspired by the bombing of Guernica, Spain, during the Spanish Civil War, Pablo Picasso completed this most famous piece, Guernica, in 1937. This piece was originally commissioned by the Spanish government and intended to depict the suffering of war and ultimately stand as symbol for peace.' },
    { id: '19a84cec-886a-4b8e-a8ad-e194e9f2170f', image: '/assets/img/initials/Bal_du_moulin_de_la_Galette.jpg', title: 'Bal du moulin de la Galette', artist: 'Pierre-Auguste Renoires', ranking: '19', description: 'While the imagery in this painting might not be the most immediately recognizable, having sold for $78.1 million (adjusted price of $127.4 million), French artist Pierre-Auguste Renoires Bal du Moulin de la Galette is one of the most expensive paintings of all time and therefore, one of the most famous.' },
    { id: '19ce6a30-cea8-4500-b716-3b93c9e9e614', image: '/assets/img/initials/No._5,_1948.jpg', title: 'No. 5, 1948', artist: 'Jackson Pollock', ranking: '18', description: 'Jackson Pollock was an influential American painter and a major figure in the abstract expressionist movement. No. 5, 1948 is one of his most famous drip paintings, created by pouring and dripping household paint onto a horizontal canvas. It\'s considered a masterpiece of abstract expressionism.' },
    { id: '1e40e548-3a7e-44fa-b151-dc790129b5a5', image: '/assets/img/initials/Girl_with_a_Pearl_Earring.jpg', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', ranking: '8', description: 'Considered by some to be the Mona Lisa of the North, this enchanting painting by the Dutch artist, Johannes Vermeer, features exactly what the title infers - a Girl with a Pearl Earring. Completed circa 1665, this piece can now be found in the Mauritshuis Gallery in The Hague.' },
    { id: '357f3f59-c661-45b9-b4a1-25114877d2cf', image: '/assets/img/initials/Dogs_Playing_Poker.jpg', title: 'Dogs Playing Poker', artist: 'C.M. Coolidge', ranking: '20', description: 'Commissioned by Brown & Begelow Cigars in 1903, American painter C.M. Coolidge painted 16 unforgettable images of Dogs Playing Poker for the brand. Spoofed many times in greeting cards and in popular culture, this series of dogs playing cards around a table is widely recognizable and truly iconic.' },
    { id: '36bdf097-ffd7-4a03-a5b7-a311addcfb29', image: '/assets/img/initials/Whistler\'s_Mother.jpg', title: 'Whistler\'s Mother', artist: 'James McNeill Whistler', ranking: '9', description: 'Whistler\'s Mother is the truncated name for James McNeill Whistler\'s very famous portrait originally known as Arrangement in Grey and Black: The Artist\'s Mother. Painted in 1871, it\'s one of the few American pieces on this list - although it is owned by a Parisian museum and therefore rarely seen in the states.' },
    { id: '469f9406-e2f4-48f6-93b0-ff38f49f281e', image: '/assets/img/initials/A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte.jpg', title: 'A Sunday Afternoon on the Island of La Grande Jatte', artist: 'Georges Seurat', ranking: '7', description: 'Using the unique technique of pointillism, creating a complete image that is made up of only distinct individual dots, the French painter Georges Seurat brings us his most famous piece A Sunday Afternoon on the Island of La Grande Jatte.' },
    { id: '4be977a0-bf12-47d9-965a-98610f4d315a', image: '/assets/img/initials/American_Gothic.jpg', title: 'American Gothic', artist: 'Grant Wood', ranking: '15', description: 'Marking the list as another iconic piece in American art, American Gothic, painted by Grant Wood in 1930 is a dry depiction of a farmer and his Plain-Jane daughter - The Great Depression personified.' },
    { id: '671fa6fd-da4a-4d28-b4f4-065e7500ece7', image: '/assets/img/initials/The_Mona_Lisa.jpg', title: 'The Mona Lisa', artist: 'Leonardo da Vinci', ranking: '1', description: 'Any list of Most Famous paintings would be incomplete without the mention of the Mona Lisa by Leonardo da Vinci. This infamous portrait of Lisa del Giocondo was completed some time between 1503-1519 and currently on display at the Musee du Louvre in Paris.' },
    { id: '855a5f67-34f4-4cab-a066-b89722872459', image: '/assets/img/initials/Portrait_de_L\'artiste_Sans_Barbe.jpg', title: 'Portrait de L\'artiste Sans Barbe', artist: 'Vincent van Gogh', ranking: '10', description: 'Although the title isn\'t very creative, Vincent van Gogh\'s Self-Portrait without Beard is certainly one of the most notable paintings of all time. While Van Gogh has painted many portraits before, this is the most notable because it\'s one of the few that depicts him without a beard. Additionally, having sold for $71.5 million in 1998, it is one of the most expensive paintings ever sold.' },
    { id: '9b48103a-6402-42d0-a0d1-370105aac378', image: '/assets/img/initials/Three_Musicians.jpg', title: 'Three Musicians', artist: 'Pablo Picasso', ranking: '6', description: 'At first glance, it might look like a collage, but Pablo Picasso\'s famous painting, Three Musicians, is actually an oil painting. Completed in 1921, he painted two very similar paintings that are mutually referred to as Three Musicians and can be found in the New York MoMA and the Philadelphia Museum of Art.' },
    { id: '9f84b33d-df8a-4afe-896c-dba4ec2a11b5', image: '/assets/img/initials/The_Son_of_Man.jpg', title: 'The Son of Man', artist: 'Rene Magritte', ranking: '17', description: 'The most current piece of all on this list, painted in 1964, is Rene Magrittees The Son of Man. Although it is a self-portrait, his face is largely covered by a floating green apple and contributes to his series of paintings known as the The Great War on Facades.' },
    { id: 'd7be9d31-aca9-4c6c-8c6a-457df1889d00', image: '/assets/img/initials/Water_Lilies.jpg', title: 'Water Lilies', artist: 'Claude Monet', ranking: '13', description: 'French painter Claude Monet painted a series of 250 pieces known as Water Lilies between 1840 and 1926 - it\'s exactly what it sounds like, 250 paintings depicting a water lily pond from his backyard. While this might not be one individual painting, considering the collection is spread amongst the most renowned galleries of the world, the series deserves a spot on this list.' },
    { id: 'd8694e59-309f-4d56-a0d6-da82d921b0eb', image: '/assets/img/initials/Starry_Night.jpg', title: 'Starry Night', artist: 'Vincent van Gogh', ranking: '2', description: 'Vincent van Gogh has painted countless well-known pieces; however, his painting Starry Night is widely considered to be his magnum opus. Painted in 1889, the piece was done from memory and whimsically depicts the view from his room at the sanitarium he resided in at the time.' },
    { id: 'dd06724d-97f2-47cd-a1b7-b523c98f7acc', image: '/assets/img/initials/The_Kiss.jpg', title: 'The Kiss', artist: 'Gustav Klimt', ranking: '12', description: 'Easily touted as Gustav Klimt\'s most famous painting, The Kiss is a realistic yet geometric depiction of a kissing couple, completed in 1908 in Vienna, Austria. What makes this piece different than the other oil paintings on the list is that it also incorporates gold leaf on canvas (in addition to oils).' },
    { id: 'e0cab2f7-4ac4-4d8f-8203-5a8591d10711', image: '/assets/img/initials/The_Flower_Carrier.jpg', title: 'The Flower Carrier', artist: 'Diego Rivera', ranking: '14', description: 'Known in its native tongue as Cargador de Flores, The Flower Carrier was painted by Diego Rivera in 1935. Widely considered to be the greatest Mexican painter of the twentieth century, Rivera was known for his simple paintings dominated by their bright colors and The Flower Carrier is no exception.' },
    { id: 'eb1adf7a-4813-456f-8583-7771e4184f7a', image: '/assets/img/initials/The_Scream.jpg', title: 'The Scream', artist: 'Edvard Munch', ranking: '3', description: 'Using oil and pastel on cardboard, Edvard Munch painted his most famous piece, The Scream, circa 1893. Featuring a ghoulish figure that looks like the host from Tales from the Crypt, the backdrop of this expressionist painting is said to be Oslo, Norway.' },
    { id: 'ecb7ea8c-03de-4847-a28d-a2f4ea0790b4', image: '/assets/img/initials/The_Night_Watch.jpg', title: 'The Night Watch', artist: 'Rembrandt van Rijn', ranking: '11', description: 'In its native Dutch tongue, De Nachtwacht is most popularly referred to in modern culture as The Night Watch. Using oil on canvas, Rembrandt (van Rijn) was commissioned by a militia captain and his 17 militia guards in 1642 to paint their company, in an effort to show off for the French Queen that would be visiting.' }
];

const resetPaintings = async (req, res) => {
    try {
      console.log('Reset gestart: bezig met opruimen van gebruikers-schilderijen...');
      const userPaintings = await Painting.findAll({
        where: { image: { [Op.notLike]: '%/initials/%' } }
      });

      for (const p of userPaintings) {
        if (p.image) {
          const imagePath = path.join(__dirname, '..', 'public', p.image);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
      }

      console.log('Bezig met resetten van de database tabel...');
      await Painting.destroy({ where: {}, truncate: true });
      await Painting.bulkCreate(initialPaintings);

      console.log('Reset voltooid.');
      res.json({ message: `Database is succesvol gereset naar de originele 20 schilderijen.` });

    } catch (error) {
      console.error('FATALE FOUT bij resetten dataset:', error);
      res.status(500).json({ error: 'Er is een fout opgetreden bij het resetten van de dataset.' });
    }
};

module.exports = {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings
};
