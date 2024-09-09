using Microsoft.EntityFrameworkCore;
using DINOFINAL.Models;

namespace DINOFINAL.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<GameResult> GameResults { get; set; }
    }
}
