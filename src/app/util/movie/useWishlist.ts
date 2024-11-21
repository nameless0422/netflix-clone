interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

class WishlistManager {
    private wishlist: Movie[] = [];
    isLoggedIn: boolean = false; // 로그인 상태 확인
    userEmail: string = ""; // 현재 사용자 이메일

    constructor(){
        this.checkLoginStatus();
    }
    // 사용자별 로컬스토리지 키 생성
    private getStorageKey(userEmail: string): string {
        return `wishlist_${userEmail}`;
    }

    // 위시리스트 로드
    loadWishlist(): void {
        const storedWishlist = localStorage.getItem(this.getStorageKey(this.userEmail));
        this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    }

    // 위시리스트 저장
    private saveWishlist(): void {
        localStorage.setItem(this.getStorageKey(this.userEmail), JSON.stringify(this.wishlist));
    }

    // 영화 추가/제거 (좋아요 토글)
    toggleWishlist(movie: Movie): void {
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

    private checkLoginStatus(): void {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          this.userEmail = JSON.parse(storedUser).id; // 이메일 정보 가져오기
          this.isLoggedIn = !!this.userEmail;
        } else {
          this.isLoggedIn = false;
        }
      }
}

export default WishlistManager;
