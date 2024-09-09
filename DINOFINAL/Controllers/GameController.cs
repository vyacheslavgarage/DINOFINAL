using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using DINOFINAL.Data;
using DINOFINAL.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DINOFINAL.Controllers
{
    public class GameController : Controller
    {
        private readonly ApplicationDbContext _context;

        public GameController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Метод для отображения лучших результатов
        public IActionResult HighScores()
        {
            var highScores = _context.GameResults
                .OrderByDescending(r => r.Score) // Сортировка по убыванию счёта
                .Take(10) // Отображение только 10 лучших результатов
                .ToList();

            return View(highScores);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveResult([FromBody] GameResult result)
        {
            if (result != null && result.Score > 0) // Проверка на валидность результата
            {
                _context.GameResults.Add(result);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest("Invalid result");
        }
    }
}