interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

class WishlistManager {
    private wishlist: Movie[] = [];
    private currentUser: string | null = null;

    constructor() {
        this.loadCurrentUser();
        this.loadWishlist();
    }

    // 현재 로그인된 사용자 ID 로드
    private loadCurrentUser(): void {
        this.currentUser = localStorage.getItem('currentUser');
    }

    // 사용자별 로컬스토리지 키 생성
    private getStorageKey(): string {
        return `wishlist_${this.currentUser}`;
    }

    // 위시리스트 로드
    loadWishlist(): void {
        if (!this.currentUser) {
            this.wishlist = [];
            return;
        }

        const storedWishlist = localStorage.getItem(this.getStorageKey());
        this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    }

    // 위시리스트 저장
    private saveWishlist(): void {
        if (!this.currentUser) return;
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.wishlist));
    }

    // 영화 추가/제거 (좋아요 토글)
    toggleWishlist(movie: Movie): void {
        if (!this.currentUser) {
            console.error('User not logged in.');
            return;
        }

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
