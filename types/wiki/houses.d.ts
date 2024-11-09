/**
 * Represents a small house entity.
 *
 * @interface IHouseSmall
 * @extends {IEntity}
 *
 * @property {string} name - The name of the house.
 * @property {(string | null | undefined)} [imgUrl] - The URL of the house image. It can be a string, null, or undefined.
 */
declare interface IHouseSmall extends IEntity {
  name: string;
  imgUrl?: string | null;
}
/**
 * Represents a house entity.
 *
 * @interface IHouse
 * @extends {IHouseSmall}
 *
 * @property {string} sigil - The sigil of the house.
 * @property {string} words - The house words.
 * @property {IPlaceSmall} seat - The seat of the house.
 * @property {ICharacterSmall} founder - The founder of the house.
 */
declare interface IHouse extends IHouseSmall {
  sigil?: string;
  words?: string;
  seat?: IPlaceSmall;
  founder?: ICharacterSmall;
}
/**
 * Represents a house data transfer object.
 *
 * @interface IHouseDTO
 * @extends {IHouseSmall}
 *
 * @property {string} sigil - The sigil of the house.
 * @property {string} words - The house words.
 * @property {string} seatId - The ID of the house seat.
 * @property {string} founderId - The ID of the house founder.
 */
declare interface IHouseDto extends IHouseSmall {
  sigil?: string;
  words?: string;
  seatId?: string;
  founderId?: string;
}
