interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

class WishlistManager {
    private wishlist: Movie[] = [];

    // 사용자별 로컬스토리지 키 생성
    private getStorageKey(userEmail: string): string {
        return `wishlist_${userEmail}`;
    }

    // 위시리스트 로드
    loadWishlist(userEmail: string): void {
        const storedWishlist = localStorage.getItem(this.getStorageKey(userEmail));
        this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    }

    // 위시리스트 저장
    private saveWishlist(userEmail: string): void {
        localStorage.setItem(this.getStorageKey(userEmail), JSON.stringify(this.wishlist));
    }

    // 영화 추가/제거 (좋아요 토글)
    toggleWishlist(movie: Movie, userEmail: string): void {
        const index = this.wishlist.findIndex(item => item.id === movie.id);
        if (index === -1) {
            this.wishlist.push(movie); // 위시리스트에 추가
        } else {
            this.wishlist.splice(index, 1); // 위시리스트에서 제거
        }
        this.saveWishlist(userEmail); // 변경사항 저장
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
