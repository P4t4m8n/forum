/**
 * Represents a small place entity.
 *
 * @interface IPlaceSmall
 * @extends {IEntity}
 *
 * @property {string} name - The name of the place.
 * @property {string} [type] - The type of the place (optional).
 * @property {string | null} [imgUrl] - The URL of the image representing the place (optional).
 */
declare interface IPlaceSmall extends IEntity {
  name: string;
  type?: string;
  imgUrl?: string | null;
}

/**
 * Represents a place entity.
 *
 * @interface IPlace
 * @extends {IPlaceSmall}
 *
 * @property {IHouseSmall | ICharacterSmall} ruler - The ruler of the place.
 */
declare interface IPlace extends IPlaceSmall {
  ruler: IHouseSmall | ICharacterSmall;
}

/**
 * Represents a place data transfer object.
 *
 * @interface IPlaceDto
 * @extends {IEntity}
 *
 * @property {string} name - The name of the place.
 * @property {number | null} [typeId] - The ID of the type of the place (optional).
 * @property {string | null} [imgUrl] - The URL of the image representing the place (optional).
 * @property {string | null} [rulerId] - The ID of the ruler of the place (optional).
 * @property {'house' | 'character' | null} [rulerType] - The type of the ruler of the place (optional).
 * @property {Date} [createdAt] - The date when the place was created.
 * @property {Date | null} [updatedAt] - The date when the place was last updated (optional).
 */
declare interface IPlaceDto extends IEntity {
  name: string;
  typeId?: string | null;
  imgUrl?: string | null;
  rulerId?: string | null;
  rulerType?: "house" | "character" | null;

  createdAt?: Date;
  updatedAt?: Date | null;
}
