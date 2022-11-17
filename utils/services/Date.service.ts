class DateService {
  convertDateString(date: Date) {
    const year = date.getFullYear();
    const month = this.convertNumberToString(date.getMonth() + 1);
    const day = this.convertNumberToString(date.getDate());
    const hour = this.convertNumberToString(date.getHours());
    const minute = this.convertNumberToString(date.getMinutes());
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  }

  convertBirthDateString(date: Date) {
    const year = date.getFullYear();
    const month = this.convertNumberToString(date.getMonth() + 1);
    const day = this.convertNumberToString(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private convertNumberToString(num: number): string {
    return num >= 10 ? `${num}` : `0${num}`;
  }
}

export default new DateService();
