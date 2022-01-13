export interface Page<T> {
  currentPage: number;
  pageRecord: number;
  endRow: number;
  pageCount: number;
  pageOne: number;
  pageTwo: number;
  recordCount: number;
  startRow: number;
  result: Array<T>;
}
