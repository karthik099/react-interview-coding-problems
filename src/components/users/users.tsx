import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import "./users.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
}

const LIMIT = 10;

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [gender, setGender] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [search]);

  // Infinite scroll hook
  const lastUserRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // fetch users (memoized)
  const fetchUsers = useCallback(
    async (page: number, search: string, gender: string) => {
      setLoading(true);
      try {
        const skip = page * LIMIT;
        const res = await fetch(
          `https://dummyjson.com/users/search?q=${
            search.split(" ")[0] ?? ""
          }&limit=${LIMIT}&skip=${skip}`
        );
        const data = await res.json();

        let newUsers: User[] = data.users;

        // Multi-word search
        if (search.trim()) {
          const tokens = search.toLowerCase().split(/\s+/);
          newUsers = newUsers.filter((u) => {
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
            const email = u.email.toLowerCase();
            return tokens.every((t) => fullName.includes(t) || email.includes(t));
          });
        }

        // Gender filter
        if (gender) {
          newUsers = newUsers.filter(
            (u: User) => u.gender.toLowerCase() === gender.toLowerCase()
          );
        }

        if (newUsers.length === 0) {
          setHasMore(false);
        } else {
          setUsers((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const uniqueNew = newUsers.filter((u) => !existingIds.has(u.id));
            return [...prev, ...uniqueNew].sort((a, b) => a.id - b.id);
          });
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reset when search/gender changes
  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearch, gender]);

  // Fetch on page/debouncedSearch/gender changes
  useEffect(() => {
    fetchUsers(page, debouncedSearch, gender);
  }, [page, debouncedSearch, gender, fetchUsers]);

  // Memoized table rows
  const userRows = useMemo(
    () =>
      users.map((user, index) => {
        const isLast = index === users.length - 1;
        return (
          <tr ref={isLast ? lastUserRef : null} key={user.id}>
            <td>{user.id}</td>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>{user.email}</td>
            <td>{user.gender}</td>
          </tr>
        );
      }),
    [users, lastUserRef]
  );

  return (
    <div className="p20">
      <h2>User List with Infinite Scroll</h2>

      {/* search + filter */}
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search by name/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* user table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </table>

      {/* loader */}
      {loading && <p>Loading...</p>}
      {!hasMore && !loading && users.length > 0 && <p>No more users</p>}
    </div>
  );
}
