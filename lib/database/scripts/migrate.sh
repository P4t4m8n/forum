for file in migrations/*.sql; do
    echo "Running migration: $file"
    psql -U yourUsername -d yourDatabase -f "$file"
done