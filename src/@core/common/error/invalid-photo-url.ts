import DomainError from './domain.error';
import ErrorCode from './error-code';

export default class InvalidPhotoUrlError extends DomainError {
  constructor(searchCriteria: {
    url?: string;
  }) {
    super(ErrorCode.INVALID_PHOTO_URL, searchCriteria);
  }
}
