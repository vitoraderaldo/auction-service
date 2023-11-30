import DomainError, { ErrorCode } from './domain.error';

export default class InvalidPhotoUrlError extends DomainError {
  constructor(searchCriteria: {
    url?: string;
  }) {
    super(ErrorCode.INVALID_PHOTO_URL, searchCriteria);
  }
}
