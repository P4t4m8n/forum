declare interface ICharacterSmall extends IEntity {
  name?: string;
  imgUrl?: string | null;
}

declare interface ICharacter extends ICharacterSmall {
  gender: IGender;
  originPlace: IPlaceSmall | null;
  born?: string | null;
  death?: string | null;
  father?: ICharacterSmall | null;
  mother?: ICharacterSmall | null;
  spouse?: ICharacterSmall | null;
  characterRelationships: Record<
    "children" | "lovers" | "sibling",
    ICharacterSmall[] | null
  >;
  cultures: ICultureSmall[];
  religions: IReligionSmall[];
  titles: ITitle[];
  actor?: string | null;
  status?: string;
  createdAt: Date;
  updatedAt?: Date | null;
  houses: IHouseSmall[];
  seasons: number[];
}

declare interface ICharacterDto extends ICharacterSmall {
  genderId?: string;
  originPlaceId?: string | null;
  born?: string | null;
  death?: string | null;
  actor?: string | null;
  statusId?: string;
  seasons?: number[];
  createdAt?: Date;
  updatedAt?: Date | null;
  titleIds?: string[];
  characterRelationships?: ICharacterRelationship[];
  housesIds?: string[];
  religionIds?: string[];
  cultureIds?: string[];
}

declare interface ICharacterRelationshipDto extends IEntity {
  characterId?: string;
  relationTypeId: string;
  relatedCharacterId: string;
}

declare interface ICharacterTitleDto {
  characterId: string;
  titleId: string;
}