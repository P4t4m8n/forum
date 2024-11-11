/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import {
  createCharacter,
  createCharacterRelationship,
  getCharacterRelationships,
  getCharacters,
  updateCharacter,
  // getCharacters,
} from "../actions/wiki/character.action";
import {
  createLookupTable,
  getLookupTable,
  // getLookupTable,
} from "../actions/wiki/lookupTable.action";
import {
  createPlace,
  getPlaces,
  // getPlaceById,
  // getPlaces,
} from "../actions/wiki/place.action";
import {
  createHouse,
  createVassal,
  getHouses,
  getVassals,
  // getHouseById,
  // getHouses,
} from "../actions/wiki/house.action";
import { createQuote, getQuotes } from "../actions/wiki/quote.action";
import { createReligion, getReligions } from "../actions/wiki/religion.action";
import { createCulture, getCultures } from "../actions/wiki/culture.action";
const LOCATION = "lib/database/data/";
const GENDERS = ["male", "female"];
const CHARACTER_STATUSES = [
  "alive",
  "deceased",
  "presumed dead",
  "resurrected",
  "unknown",
];

const RELATIONS_TYPES = [
  "mother",
  "children",
  "sibling",
  "spouse",
  "lovers",
  "father",
];
const TYPES = ["Castle", "City", "Palace", "City-State"];
export const seed = async () => {
  console.log("Seeding started");
  // const genders = await getLookupTable("genders");
  // const titles = await getLookupTable("titles");
  // const placeTypes = await getLookupTable("place_types");
  // const statuses = await getLookupTable("character_statuses");
  // const religions = await getReligions();
  // const cultures = await getCultures();
  // const relationTypes = await getLookupTable("relationship_types");

  // const characters = await getCharacters();
  // const houses = await getHouses();
  // const places = await getPlaces();
  // const quotes = await getQuotes();

  // const vassals = await getVassals();
  // const relations = await getCharacterRelationships();

  const cultures = await seedCultures();
  const religions = await seedReligions();
  const titles = await seedTitles();
  const genders = await seedLookupTables(GENDERS, "genders");
  const statuses = await seedLookupTables(
    CHARACTER_STATUSES,
    "character_statuses"
  );
  const relationTypes = await seedLookupTables(
    RELATIONS_TYPES,
    "relationship_types"
  );
  const placeTypes = await seedLookupTables(TYPES, "place_types");
  const characters = await seedCharacters(
    genders!,
    statuses!,
    titles!,
    religions!,
    cultures!
  );
  const houses = await seedHouses(characters!, genders!, statuses!);
  const places = await seedPlaces(placeTypes!, houses!);
  const quotes = await seedQuotes(characters!, genders!, statuses!);

  await seedCharactersRelations(
    characters!,
    relationTypes!,
    genders!,
    statuses!
  );

  await seedVassals(houses!);

  await updateCharacterOrigin(characters!, places!, placeTypes!);

  // console.log("cultures:", cultures?.length);
  // console.log("religions:", religions?.length);
  // console.log("relationTypes:", relationTypes?.length);
  // console.log("titles:", titles?.length);
  // console.log("genders:", genders?.length);
  // console.log("statuses:", statuses?.length);
  // console.log("placeTypes:", placeTypes?.length);
  // console.log("characters:", characters?.length);
  // console.log("houses:", houses?.length);
  // console.log("places:", places?.length);
  // console.log("quotes:", quotes?.length);
  console.info("Seeding done");
};

const seedLookupTables = async (items: string[], key: TLookupTableName) => {
  try {
    const res = [];
    for (const i of items) {
      const g = await createLookupTable(key, i);
      res.push(g);
    }
    return res;
  } catch (error) {
    console.error("Error seeding lookup tables:", error);
  }
};

const seedTitles = async () => {
  try {
    const charactersData = readData(`${LOCATION}characters.json`);
    const titles = [];
    for (let i = 0; i < charactersData.length; i++) {
      if (charactersData[i]?.titles) {
        titles.push(charactersData[i]?.titles);
      }
    }

    const cleanTitles = cleanDuplication(titles.flat());
    const savedTitles = [];
    for (const title of cleanTitles) {
      const t = await createLookupTable("titles", title);
      savedTitles.push(t);
    }
    return savedTitles;
  } catch (error) {
    console.error("Error seeding titles:", error);
  }
};

const seedCultures = async () => {
  try {
    const charactersData = readData(`${LOCATION}characters.json`);
    const cultures = cleanDuplication(
      charactersData.map((c: any) => c.culture)
    );

    const saveCultures = [];
    for (const culture of cultures) {
      const dto: ICultureDTO = {
        name: culture,
        imgUrl: "",
      };
      const c = await createCulture(dto);
      saveCultures.push(c);
    }

    return saveCultures;
  } catch (error) {
    console.error("Error seeding cultures:", error);
  }
};

const seedReligions = async () => {
  try {
    const charactersData = readData(`${LOCATION}characters.json`);
    const religions = cleanDuplication(
      charactersData.map((c: any) => c.religion)
    );
    const savedReligions = [];
    for (const religion of religions) {
      const dto: IReligionDto = {
        name: religion,
        imgUrl: "",
      };
      const r = await createReligion(dto);
      savedReligions.push(r);
    }
    return savedReligions;
  } catch (error) {
    console.error("Error seeding religions:", error);
  }
};

const cleanDuplication = (items: string[]) => {
  return items.filter((item, index) => items.indexOf(item) === index);
};

const seedCharacters = async (
  genders: ILookupTable[],
  statuses: ILookupTable[],
  titles: ILookupTable[],
  religions: IReligionSmall[],
  cultures: ICultureSmall[]
) => {
  try {
    const charactersData = readData(`${LOCATION}characters.json`);

    const characters = [];

    for (const character of charactersData) {
      const c = await seedCharacter(
        character,
        genders,
        statuses,
        titles,
        religions,
        cultures
      );
      characters.push(c);
    }
    return characters;
  } catch (error) {
    console.error("Error seeding characters:", error);
  }
};

const seedCharacter = async (
  character: any,
  genders: ILookupTable[],
  statuses: ILookupTable[],
  titles: ILookupTable[],
  religions: IReligionSmall[],
  cultures: ICultureSmall[]
) => {
  const unknownId = statuses.find((s) => s.name === "unknown")!.id!;
  const titleIds = character?.titles?.map((t: string) => {
    return titles.find((title) => title.name === t)?.id || null;
  });
  const dto: ICharacterDto = {
    name: character?.name,
    genderId:
      genders?.find((g) => g.name === character.gender)?.id || genders[0].id!,
    born: character?.born || "unknown",
    death: character?.death || "unknown",
    actor: character?.actor || null,
    originPlaceId: null,
    cultureIds: [cultures.find((c) => c.name === character?.culture)?.id || ""],
    titleIds,
    religionIds: [
      religions.find((r) => r.name === character?.religion)?.id || "",
    ],
    statusId:
      statuses?.find((s) => s?.name === character?.status)?.id || unknownId,
    seasons: character?.seasons || [],
  };

  return await createCharacter(dto);
};

const seedCharactersRelations = async (
  characters: ICharacter[],
  relations: ILookupTable[],
  genders: ILookupTable[],
  statuses: ILookupTable[]
) => {
  const charactersData = readData(`${LOCATION}characters.json`);
  for (const character of charactersData) {
    const characterId = characters.find((c) => c.name === character.name)!.id!;
    // if (character?.father) {
    //   const fatherId = await findCharId(
    //     characters,
    //     genders,
    //     statuses,
    //     character?.father
    //   );
    //   const fatherTypeId = relations.find((r) => r.name === "father")!.id!;
    //   await createCharacterRelationship(fatherTypeId, characterId, fatherId!);
    // }
    // if (character?.mother) {
    //   const motherId = await findCharId(
    //     characters,
    //     genders,
    //     statuses,
    //     character?.mother
    //   );
    //   const motherTypeId = relations.find((r) => r.name === "mother")!.id!;
    //   await createCharacterRelationship(motherTypeId, characterId, motherId!);
    // }

    // if (character?.spouse?.length) {
    //   for (const s of character?.spouse) {
    //     console.log("s:", s)
    //     const spouseId = await findCharId(
    //       characters,
    //       genders,
    //       statuses,
    //       s
    //     );
    //     const spouseTypeId = relations.find((r) => r.name === "spouse")!.id!;
    //      await createCharacterRelationship(
    //       spouseTypeId,
    //       characterId,
    //       spouseId!
    //     );
    //   }
    // }

    // if (character?.children.length) {
    //   for (const child of character.children) {
    //     const childId = await findCharId(characters, genders, statuses, child);
    //     const childTypeId = relations.find((r) => r.name === "children")!.id!;

    //     if (childId && childTypeId) {
    //       await createCharacterRelationship(childTypeId, characterId, childId!);
    //     }
    //   }
    // }

    // if (character?.siblings.length) {
    //   for (const sibling of character?.siblings) {
    //     const siblingId = await findCharId(
    //       characters,
    //       genders,
    //       statuses,
    //       sibling
    //     );
    //     const siblingTypeId = relations.find((r) => r.name === "sibling")!.id!;
    //     if (siblingId && siblingTypeId) {
    //       await createCharacterRelationship(
    //         siblingTypeId,
    //         characterId,
    //         siblingId!
    //       );
    //     }
    //   }
    // }

    if (character?.lovers?.length) {
      for (const lover of character?.lovers) {
        const loverId = await findCharId(characters, genders, statuses, lover);
        const loverTypeId = relations.find((r) => r.name === "lovers")!.id!;
        if (loverId && loverTypeId) {
          await createCharacterRelationship(loverTypeId, characterId, loverId!);
        }
      }
    }
  }
};

const updateCharacterOrigin = async (
  characters: ICharacter[],
  places: IPlaceSmall[],
  types: ILookupTable[]
) => {
  try {
    const charactersData = readData(`${LOCATION}characters.json`);
    for (const data of charactersData) {
      let placeId = places.find((p) => p?.name === data?.origin)?.id || null;
      if (!placeId) {
        const dto: IPlaceDto = {
          name: data?.origin,
          typeId: types[0].id,
          rulerType: "house",
        };
        placeId = (await createPlace(dto)).id!;
      }

      const charId = characters.find((c) => c.name === data?.name)?.id;

      const c = await updateCharacter({ id: charId!, originPlaceId: placeId! });
      console.log("c:", c);
    }
  } catch (error) {
    console.error("Error updating character origin:", error);
  }
};

const seedHouses = async (
  characters: ICharacter[],
  genders: ILookupTable[],
  statuses: ILookupTable[]
) => {
  try {
    const houses = [];
    const housesData = readData(`${LOCATION}houses.json`);

    for (const house of housesData) {
      const h = await seedHouse(house, characters, genders, statuses);
      houses.push(h);
    }
    return houses;
  } catch (error) {
    console.error("Error seeding houses:", error);
  }
};

const seedHouse = async (
  housesData: any,
  characters: ICharacter[],
  genders: ILookupTable[],
  statuses: ILookupTable[]
) => {
  let founderId = null;

  if (housesData?.founder) {
    founderId = characters.find((c) => c.name === housesData?.founder)?.id;
    if (!founderId) {
      founderId =
        (
          await seedCharacter(
            { name: housesData?.founder },
            genders,
            statuses,
            [],
            [],
            []
          )
        )?.id || null;
    }
  }

  const dto: IHouseDto = {
    name: housesData?.name || "",
    sigil: housesData?.sigil || "",
    words: housesData?.words || "",
    founderId,
    seatId: null,
  };
  return await createHouse(dto);
};

const seedVassals = async (houses: IHouse[]) => {
  try {
    const housesData = readData(`${LOCATION}houses.json`);
    for (const data of housesData) {
      for (const vassal of data?.vassals) {
        const houseId = houses.find((h) => h.name === data?.name)!.id!;
        let vassalId = houses.find((h) => h.name === vassal)?.id || null;
        if (!vassalId) {
          vassalId = (await seedHouse({ name: vassal }, [], [], [])).id!;
        }
        console.log("vassalId:", vassalId);
        await createVassal(houseId, vassalId!);
      }
    }
  } catch (error) {
    console.error("Error seeding vassals:", error);
  }
};

const seedPlaces = async (types: ILookupTable[], houses: IHouse[]) => {
  const placesData = readData(`${LOCATION}places.json`);
  const places = [];
  try {
    for (const place of placesData) {
      const p = await seedPlace(place, types, houses);
      places.push(p);
    }
    return places;
  } catch (error) {
    console.error("Error seeding places:", error);
  }
};
const seedPlace = async (
  place: any,
  types: ILookupTable[],
  houses: IHouse[]
) => {
  let rulerId = null;
  if (place?.rulers) {
    rulerId = houses.find((h) => h?.name === place?.rulers)?.id || null;
    if (!rulerId) {
      rulerId =
        (await seedHouse({ name: place?.rulers }, [], [], [])).id || null;
    }
  }
  const dto: IPlaceDto = {
    name: place?.name,
    typeId: types.find((t) => t?.name === place?.type)?.id || types[0].id!,
    rulerType: "house",
    rulerId,
  };
  return await createPlace(dto);
};
const seedQuotes = async (
  characters: ICharacter[],
  genders: ILookupTable[],
  statuses: ILookupTable[]
) => {
  try {
    const quotesData = readData(`${LOCATION}quotes.json`);
    const quotes = [];

    for (const q of quotesData) {
      const fromCharacterId = await findCharId(
        characters,
        genders,
        statuses,
        q?.from
      );
      const toCharacterId = await findCharId(
        characters,
        genders,
        statuses,
        q?.to
      );
      const dto: IQuoteDto = {
        quote: q.quote,
        fromCharacterId,
        toCharacterId,
      };

      const quote = await createQuote(dto);
      quotes.push(quote);
    }

    return quotes;
  } catch (error) {
    console.error("Error seeding quotes:", error);
  }
};
const findCharId = async (
  characters: ICharacter[],
  genders: ILookupTable[],
  statuses: ILookupTable[],
  name?: string | null
) => {
  if (!name) return null;

  let id = characters.find((c) => c.name === name)?.id || null;
  if (!id) {
    id =
      (await seedCharacter({ name }, genders, statuses, [], [], []))?.id ||
      null;
  }

  return id;
};
// const writeData = (data: unknown, name?: string) => {
//   try {
//     const timestamp = new Date().toISOString().replace(/:/g, "-");
//     const dbFilePath = `db-${name || timestamp}.json`;

//     fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
//   } catch (error) {
//     console.error("Error saving file:", error);
//   }
// };
const readData = (location: string) => {
  try {
    const data = fs.readFileSync(location, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
};
