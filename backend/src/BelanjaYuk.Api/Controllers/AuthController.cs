using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.DTOs.Auth;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthController(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
    {
        // 1. Validation for FullName
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Nama lengkap wajib diisi."));
        }

        // 2. Validation for Username
        var userName = request.UserName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(userName))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Username wajib diisi."));
        }
        if (userName.Length < 5 || userName.Length > 30)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Username harus 5–30 karakter."));
        }
        var existingUsername = await _context.MsUsers.AnyAsync(u => u.UserName.ToLower() == userName.ToLower());
        if (existingUsername)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Username sudah digunakan."));
        }

        // 3. Validation for Email
        var email = request.Email?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Email wajib diisi."));
        }
        if (!email.Contains("@") || !Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Format email tidak valid."));
        }
        var existingEmail = await _context.MsUsers.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        if (existingEmail)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Email sudah terdaftar."));
        }

        // 4. Validation for Phone Number
        var phone = request.PhoneNumber?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(phone))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Nomor HP wajib diisi."));
        }
        if (!Regex.IsMatch(phone, @"^(\+62|08)[0-9]{8,13}$"))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Nomor HP tidak valid."));
        }
        var existingPhone = await _context.MsUsers.AnyAsync(u => u.PhoneNumber == phone);
        if (existingPhone)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Nomor HP sudah terdaftar."));
        }

        // 5. Validation for Password
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Kata sandi wajib diisi."));
        }
        if (request.Password.Length < 8)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Kata sandi minimal 8 karakter."));
        }

        // 6. Validation for Optional Address
        if (!string.IsNullOrWhiteSpace(request.AlamatLengkap) && request.AlamatLengkap.Trim().Length < 10)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Alamat minimal 10 karakter."));
        }

        // Name parsing
        var nameParts = request.FullName.Trim().Split(' ', 2);
        var firstName = nameParts[0];
        var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

        // Gender mapping
        string? idGender = null;
        if (!string.IsNullOrWhiteSpace(request.GenderName))
        {
            var genderEntity = await _context.LtGenders.FirstOrDefaultAsync(g => g.GenderName.ToLower() == request.GenderName.Trim().ToLower());
            if (genderEntity != null)
            {
                idGender = genderEntity.IdGender;
            }
        }

        var userId = Guid.NewGuid().ToString();

        var user = new MsUser
        {
            IdUser = userId,
            UserName = userName,
            Email = email,
            PhoneNumber = phone,
            FirstName = firstName,
            LastName = lastName,
            DOB = request.DOB,
            IdGender = idGender
        };

        var userPassword = new MsUserPassword
        {
            IdUserPassword = Guid.NewGuid().ToString(),
            IdUser = userId,
            PasswordHash = _passwordHasher.HashPassword(request.Password)
        };

        _context.MsUsers.Add(user);
        _context.MsUserPasswords.Add(userPassword);

        // Optional Primary Address creation
        if (!string.IsNullOrWhiteSpace(request.AlamatLengkap))
        {
            var address = new TrHomeAddress
            {
                IdHomeAddress = Guid.NewGuid().ToString(),
                IdUser = userId,
                Provinsi = request.Provinsi?.Trim() ?? "-",
                KotaKabupaten = request.KotaKabupaten?.Trim() ?? "-",
                Kecamatan = request.Kecamatan?.Trim() ?? "-",
                KodePos = request.KodePos?.Trim() ?? "-",
                HomeAddressDesc = request.AlamatLengkap.Trim(),
                IsPrimaryAddress = true
            };
            _context.TrHomeAddresses.Add(address);
        }

        await _context.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);

        var response = new AuthResponse
        {
            Token = token,
            IdUser = user.IdUser,
            UserName = user.UserName,
            EmailOrPhone = email,
            FullName = $"{user.FirstName} {user.LastName}".Trim()
        };

        return Ok(ApiResponse<AuthResponse>.Ok(response, "Registrasi berhasil. Akun BelanjaYuk Anda siap digunakan!"));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        var input = request.EmailOrPhone.Trim();

        var user = await _context.MsUsers
            .Include(u => u.UserPassword)
            .FirstOrDefaultAsync(u => u.Email == input || u.PhoneNumber == input || u.UserName == input);

        if (user == null)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Email atau nomor HP tidak terdaftar."));
        }

        if (user.UserPassword == null || !_passwordHasher.VerifyPassword(request.Password, user.UserPassword.PasswordHash))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Kata sandi salah."));
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        var response = new AuthResponse
        {
            Token = token,
            IdUser = user.IdUser,
            UserName = user.UserName,
            EmailOrPhone = user.Email ?? user.PhoneNumber ?? string.Empty,
            FullName = $"{user.FirstName} {user.LastName}".Trim()
        };

        return Ok(ApiResponse<AuthResponse>.Ok(response, "Login berhasil."));
    }
}
