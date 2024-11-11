declare interface IGender extends IEntity {
  genderName: string;
}

declare interface IPlaceType extends IEntity {
  placeTypeName: string;
}

declare interface ICharacterStatus extends IEntity {
  characterStatusName: string;
}

declare interface IRelationshipType extends IEntity {
  relationshipName: string;
}

declare interface ITitle extends IEntity {
  titleName: string;
}

declare interface ILookupTable extends IEntity {
  name: string;
}

declare type TLookupTableName =
  | "genders"
  | "titles"
  | "place_types"
  | "character_statuses"
  | "relationship_types";
