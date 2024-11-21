interface Movie {
    id: number;
    title: string;
    poster_path: string;
  }
  
  class WishlistManager {
    private static instance: WishlistManager;
    private wishlist: Movie[] = [];
    private userEmail: string = '';
  
    private constructor() {} // 외부에서 인스턴스 생성 불가
  
    static getInstance(): WishlistManager {
      if (!WishlistManager.instance) {
        WishlistManager.instance = new WishlistManager();
      }
      return WishlistManager.instance;
    }
  
    // 사용자 이메일 설정
    setUserEmail(email: string): void {
      this.userEmail = email;
      this.loadWishlist();
    }
  
    // 사용자별 로컬스토리지 키 생성
    private getStorageKey(userEmail: string): string {
      return `wishlist_${userEmail}`;
    }
  
    // 위시리스트 로드
    loadWishlist(): void {
      if (!this.userEmail) return;
      const storedWishlist = localStorage.getItem(this.getStorageKey(this.userEmail));
      this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    }
  
    // 위시리스트 저장
    private saveWishlist(): void {
      if (!this.userEmail) return;
      localStorage.setItem(this.getStorageKey(this.userEmail), JSON.stringify(this.wishlist));
    }
  
    // 영화 추가/제거 (좋아요 토글)
    toggleWishlist(movie: Movie): void {
      if (!this.userEmail) return;
      const index = this.wishlist.findIndex(item => item.id === movie.id);
      if (index === -1) {
        this.wishlist.push(movie); // 위시리스트에 추가
      } else {
        this.wishlist.splice(index, 1); // 위시리스트에서 제거
      }
      this.saveWishlist(); // 변경사항 저장
    }
  
    // 위시리스트에 영화가 있는지 확인
    isInWishlist(movieId: number): boolean {
      return this.wishlist.some(item => item.id === movieId);
    }
  
    // 현재 위시리스트 반환
    getWishlist(): Movie[] {
      return this.wishlist;
    }
  }
  
  export default WishlistManager;
  